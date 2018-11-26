/*
 * Warning: this code relies on millis which will overflow after 50 days.
 * No garantuee are made about this code working when millis overflows
 * Absolute timestamp is in seconds, 32-bit unsigned int. Should overflow after year 2106
 */

#include <msgpack.hpp>
#include <util/crc16.h>

#include "KilnRegulator.h"
#include "StreamCRC.h"
#include "Time.h"

#define MAX_KEY_LENGTH 31

MAX6675 thermocouple(/*thermoCLK*/6, /*thermoCS*/5, /*thermoDO*/4);

KilnRegulator kilnRegulator(thermocouple, /*outputPin*/2);

StreamCRC streamCRC(Serial);

char key[MAX_KEY_LENGTH+1] = "\0"; // buffer to store received map key

time_t lastTimesyncRequest = 0;
int timeout = 5000;
int timeoutCounter = 0;

void sendAck(StreamCRC &stream, unsigned long msgId, char action[], int code) {
	size_t mapSize = 4;
	msgpack::writeMapSize(stream, mapSize);

	msgpack::writeString(stream, "ack");
	msgpack::writeString(stream, key);

	msgpack::writeString(stream, "id");
	msgpack::writeIntU32(stream, msgId);

	msgpack::writeString(stream, "code");
	msgpack::writeInt16(stream, code);

	msgpack::writeString(stream, "crc");
	msgpack::writeIntU8(stream, stream.getCRC());
}

time_t requestTime() {
	size_t mapSize = 1;
	if (lastTimesyncRequest > 0) // request already pending, don't try again before timeout
		return 0;
	lastTimesyncRequest = millis();

	msgpack::writeMapSize(streamCRC, mapSize);

	msgpack::writeString(streamCRC, "command");
	msgpack::writeString(streamCRC, "timesync");

	return 0; // the time will be sent later in response to serial msg
}

/*
 * Message format:
 * [ "command", param]
 */
bool receiveMessage(StreamCRC &stream, KilnRegulator &kilnRegulator) {
	size_t arraySize;
	size_t keyLength;
	int errCode = 0;
	unsigned long msgId = -1;


	/*
	 * CRC computation
	 */
	stream.resetCRC();

	strcpy(key, "request");

	errCode = msgpack::readArraySize(stream, arraySize);
	if (!errCode) { // not error code but success
		errCode = ErrorCode::BAD_REQUEST +10;
		goto readerror;
	}

	if (arraySize < 2 || arraySize > 3) {
		errCode = ErrorCode::BAD_REQUEST +20;
		goto readerror;
	}

	/*
	 * Read message Id
	 */
	errCode = msgpack::readInt(stream, msgId);

	/*
	 * Read command
	 */
	errCode = msgpack::readString(stream, key, sizeof(key), keyLength);
	if (!errCode) { // not error code but success
		errCode = ErrorCode::BAD_REQUEST +30;
		goto readerror;
	}

	if (!strncmp(key, "start", keyLength+1)) { //keyLength+1 because we want to compare null character as well
		errCode = kilnRegulator.start();
		//start cooking
		//read program
	} else if (!strncmp(key, "stop", keyLength+1)) {
		errCode = kilnRegulator.stop();
		//stop cooking
	} else if (!strncmp(key, "timesync", keyLength+1)) {
		if (arraySize < 2) {
			errCode = ErrorCode::BAD_REQUEST;
			goto readerror;
		}

		//time synchronisation
		unsigned long timestamp = -1;
		errCode = msgpack::readInt(stream, timestamp);
		if (errCode) { // not error code but success
			setTime(timestamp);
			errCode = timestamp;
			lastTimesyncRequest = 0;
			timeoutCounter = 0;
		} else {
			errCode = ErrorCode::BAD_REQUEST;
			goto readerror;
		}
	} else if (!strncmp(key, "setpoint", keyLength+1)) {
		if (arraySize < 2) {
			errCode = ErrorCode::BAD_REQUEST;
			goto readerror;
		}

		long setpoint = -1;
		errCode = msgpack::readInt(stream, setpoint);
		if (errCode) { // not error code but success
			errCode = kilnRegulator.setSetpoint(setpoint);
		} else {
			errCode = ErrorCode::BAD_REQUEST;
			goto readerror;
		}
		//set setpoint
	} else if (!strncmp(key, "getprogram", keyLength+1)) {
		//send current program
	}
	sendAck(stream, msgId, key, errCode);
	return true;
readerror:
	while (Serial.available()) Serial.read(); //clear input buffer
	sendAck(stream, msgId, key, errCode);
	return false;
}

void sendState(Stream &stream, KilnRegulator &kilnRegulator) {
	size_t mapSize = 7;

	int state =  kilnRegulator.getState();
	int elementState =  kilnRegulator.getElementState();
	int segment = kilnRegulator.getCurrentSegment();
	double temperature = kilnRegulator.getTemperature();

	msgpack::writeMapSize(stream, mapSize);

	msgpack::writeString(stream, "command");
	msgpack::writeString(stream, "status");

	msgpack::writeString(stream, "state");
	msgpack::writeInt16(stream, state);

	msgpack::writeString(stream, "elementState");
	msgpack::writeInt16(stream, elementState);

	msgpack::writeString(stream, "currentSegment");
	msgpack::writeInt16(stream, segment);

	msgpack::writeString(stream, "temperature");
	msgpack::writeFloat32(stream, temperature);

	msgpack::writeString(stream, "output");
	msgpack::writeFloat32(stream, kilnRegulator.output);

	msgpack::writeString(stream, "timestamp");
	msgpack::writeIntU32(stream, now());
}


void setup() {
	Serial.begin(115200);
	while (!Serial) continue;
	delay(500); // wait for MAX chip to stabilize

	// Shut off embedded LED
	pinMode(13, OUTPUT);
	digitalWrite(13, LOW);

	kilnRegulator.init();
	setSyncProvider(requestTime);
	setTime(1); // important to init it to one since lastTimesyncRequest is reset to 0
}

void loop() {
	if (Serial.available()) {
		receiveMessage(streamCRC, kilnRegulator);
	}
	kilnRegulator.updateState();
	sendState(streamCRC, kilnRegulator);

	if (lastTimesyncRequest > 0 && lastTimesyncRequest + timeout < millis()) { // timed out
		strcpy(key, "timesync");
		sendAck(streamCRC, 0, key, ErrorCode::TIMEOUT);
		lastTimesyncRequest = 0;
		timeoutCounter++;
		if (timeoutCounter > 3) {
			// 3 timesync requests timed out, raspberry most likely not answering, do something…
		}
	}

	delay(500);
}
