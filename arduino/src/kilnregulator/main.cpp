/*
 * Warning: this code relies on millis which will overflow after 50 days.
 * No garantuee are made about this code working when millis overflows
 * Absolute timestamp is in seconds, 32-bit unsigned int. Should overflow after year 2106
 */

#include <msgpack.hpp>
#include <util/crc16.h>

#include <Time.h>
#include <IEEE754tools.h>

#include "KilnRegulator.h"
#include "Segment.h"
#include "Program.h"
#include "StreamCRC.h"
#include "Timer.h"
#include "Time.h"
#include "WatchDog.h"
#include "LCDMonitor.h"

void sendState(Stream &stream, KilnRegulator &kilnRegulator);


#define MAX_KEY_LENGTH 31

////   Adafruit_MAX31856 maxDAC(MAXcs, MAXdi, MAXdo, MAXclk);
Adafruit_MAX31856 thermocouple(/*thermoCS*/7,4,5,3);

KilnRegulator kilnRegulator(thermocouple, /*outputPin*/2);

StreamCRC streamCRC(Serial);

Program program;

Timer samplingTimer{15000}; // 15'000ms sampling rate, more or less…

WatchDog watchdog;

LCDMonitor lcdMonitor(/*cs*/10, /*dc*/8, /*rst*/9);

char key[MAX_KEY_LENGTH+1] = "\0"; // buffer to store received map key

time_t lastTimesyncRequest = 0;
int timeout = 50000;
int timeoutCounter = 0;

// Acknowledgment or error if code != 0
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

// just because the encoding process on the NodeJS side will encore a decimal number into an integer if it's dividable by 1
bool forceReadDouble(StreamCRC &stream, double &value) {
	msgpack::DataType dataFormat;
	msgpack::getNextDataType(stream, dataFormat, true);

	if (dataFormat == msgpack::Float64) { // NodeJS sends 64-bit float, we don't support double precision, try it anyway…
		uint64_t v;
		bool e = msgpack::readIntU64(stream, v, false); // read it in a uint64_t which is 8 bytes long, same as the received double, bypassing check since it's not the correct type
		value = doublePacked2Float(reinterpret_cast<unsigned char*>(&v)); // decode the 8bytes "buffer" to a 32bit float
		return e;
	} else if (dataFormat == msgpack::Float32) {
		float v;
		bool e = msgpack::readFloat32(stream, v);
		value = v;
		return e;
	} else { // assume it's an Integer. Bad assumption but who cares at this point
		int v;
		bool e = msgpack::readInt(stream, v);
		value = v;
		return e;
	}
}

/*
 * Message format:
 * [ "command", param]
 *
 * TODO: handle errCode from msgpack functions properly
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

	if (!strncmp(key, "segment", keyLength+1)) {
		int id = -1;
		double temperature = -1;
		double slope = -1;
		unsigned long duration = 0;
		bool isFull = false;
		errCode = msgpack::readArraySize(stream, arraySize);
		//assert arraySize == 4

		errCode = msgpack::readInt(stream, id);
		errCode = forceReadDouble(stream, temperature);
		errCode = forceReadDouble(stream, slope);
		errCode = msgpack::readInt(stream, duration);
		errCode = msgpack::readBool(stream, isFull);

		//assert id >= 0 && id < MAX_SEGMENT_COUNT

		program.segments[id] = {
			.temperature = temperature,
			.slope = slope,
			.duration = duration,
			.isFull = isFull
		};
		program.count++;
	}

	else if (!strncmp(key, "start", keyLength+1)) { //keyLength+1 because we want to compare null character as well
		//start cooking
		//read program

		// number of segments in the program
		int v = 0;
		errCode = msgpack::readInt(stream, v);
		//assert v == program.count

		errCode = kilnRegulator.start(program);
	} else if (!strncmp(key, "stop", keyLength+1)) {
		errCode = kilnRegulator.stop();
		//stop cooking
	} else if (!strncmp(key, "reset", keyLength+1)) {
		errCode = kilnRegulator.reset();
		program.count = 0;
		//reset cooking
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
			lastTimesyncRequest = 0;
			timeoutCounter = 0;
		} else {
			errCode = ErrorCode::BAD_REQUEST;
			goto readerror;
		}
	} else if (!strncmp(key, "setpoint", keyLength+1)) { //is it really used ? f so, why ?
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
	else if (!strncmp(key, "delay", keyLength+1)) {
		kilnRegulator.setState(KilnState::DELAYED);
		int delay = -1; //in s
		errCode = msgpack::readInt(stream, delay);
		if (errCode) { // not error code but success
			errCode = kilnRegulator.setWakeupDate(delay);
		} else {
			errCode = ErrorCode::BAD_REQUEST;
			goto readerror;
		}
	}
	sendAck(stream, msgId, key, errCode);
	kilnRegulator.updateState(); //update state as quick as possible for user expererience
	sendState(streamCRC, kilnRegulator);
	return true;
readerror:
	while (Serial.available()) Serial.read(); //clear input buffer
	sendAck(stream, msgId, key, errCode);
	return false;
}

void sendState(Stream &stream, KilnRegulator &kilnRegulator) {
	size_t mapSize = 9;

	uint32_t timestamp = now(); // get it first because it may send a time syncronisation request

	uint8_t state =  kilnRegulator.getState();
	uint8_t elementState =  kilnRegulator.getElementState();
	int8_t segment = kilnRegulator.getCurrentSegment();
	double temperature = kilnRegulator.getTemperature();

	msgpack::writeMapSize(stream, mapSize);

	msgpack::writeString(stream, "command");
	msgpack::writeString(stream, "status");

	msgpack::writeString5(stream, "s", 1); //"state"
	msgpack::writeIntU8(stream, state);

	msgpack::writeString5(stream, "eS", 2); //"elementState"
	msgpack::writeIntU8(stream, elementState);

	msgpack::writeString5(stream, "cS", 2); //"currentSegment"
	msgpack::writeInt8(stream, segment);

	msgpack::writeString5(stream, "t", 1); //"temperature"
	msgpack::writeFloat32(stream, temperature);

	msgpack::writeString5(stream, "o", 1); //"output"
	msgpack::writeFloat32(stream, kilnRegulator.output);

	msgpack::writeString5(stream, "sP", 2); //"setPoint"
	msgpack::writeFloat32(stream, kilnRegulator.setpoint);

	msgpack::writeString5(stream, "ts", 2); //"timestamp"
	msgpack::writeIntU32(stream, timestamp);
	
	msgpack::writeString5(stream, "d", 1); //"delay"
	if (state == KilnState::DELAYED){
		unsigned int secondesBeforeCooking = ((kilnRegulator.getWakeupDate() - now()));
		unsigned int minutesBeforeCooking = (unsigned int)(secondesBeforeCooking/60);
		msgpack::writeIntU32(stream, minutesBeforeCooking);
	}else{
		msgpack::writeIntU32(stream, 0);
	}
		
}


void setup() {
	Serial.begin(115200);
	while (!Serial) continue;


	thermocouple.begin();

	thermocouple.setThermocoupleType(MAX31856_TCTYPE_S);

	delay(500); // wait for MAX chip to stabilize

	// Shut off embedded LED
	pinMode(2, OUTPUT);
	digitalWrite(2, LOW);

	watchdog.init();

	lcdMonitor.init();

	kilnRegulator.init();
	setSyncProvider(requestTime);
	setTime(1); // important to init it to one since lastTimesyncRequest is reset to 0
	kilnRegulator.updateState();
	sendState(streamCRC, kilnRegulator);
	samplingTimer.start(millis());
}

void loop() {

	if (Serial.available()) {
		receiveMessage(streamCRC, kilnRegulator);
	}

	samplingTimer.update(millis());
	if (samplingTimer.expired()) {
		kilnRegulator.updateState();
		sendState(streamCRC, kilnRegulator);
		samplingTimer.start(millis());
	}

	if (lastTimesyncRequest > 0 && lastTimesyncRequest + timeout < millis()) { // timed out
		strcpy(key, "timesync");
		sendAck(streamCRC, 0, key, ErrorCode::TIMEOUT);
		lastTimesyncRequest = 0;
		timeoutCounter++;
		if (timeoutCounter > 3) {
			// 3 timesync requests timed out, raspberry most likely not answering, do something…
		}
	}

	lcdMonitor.draw(kilnRegulator);

	watchdog.update();
	delay(1000);
}
