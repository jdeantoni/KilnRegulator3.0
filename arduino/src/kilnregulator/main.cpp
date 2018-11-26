#include <msgpack.hpp>
#include <util/crc16.h>

#include "KilnRegulator.h"
#include "StreamCRC.h"

#define MAX_KEY_LENGTH 31

MAX6675 thermocouple(/*thermoCLK*/6, /*thermoCS*/5, /*thermoDO*/4);

KilnRegulator kilnRegulator(thermocouple, /*outputPin*/2);

StreamCRC streamCRC(Serial);

char key[MAX_KEY_LENGTH+1] = "\0"; // buffer to store received map key

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
	} else if (!strncmp(key, "time", keyLength+1)) {
		//time synchronisation
	} else if (!strncmp(key, "setpoint", keyLength+1)) {
		if (arraySize < 2) {
			errCode = ErrorCode::BAD_REQUEST;
			goto readerror;
		}

		long setpoint = -1;
		errCode = msgpack::readInt(stream, setpoint);
		errCode = kilnRegulator.setSetpoint(setpoint);
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
	size_t mapSize = 6;

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
}


void setup() {
	Serial.begin(115200);
	while (!Serial) continue;
	delay(500); // wait for MAX chip to stabilize

	// Shut off embedded LED
	pinMode(13, OUTPUT);
	digitalWrite(13, LOW);

	kilnRegulator.init();
}

void loop() {
	if (Serial.available()) {
		receiveMessage(streamCRC, kilnRegulator);
	}
	kilnRegulator.updateState();
	sendState(streamCRC, kilnRegulator);
	delay(500);
}
