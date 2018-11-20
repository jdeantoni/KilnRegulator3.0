#include <msgpack.hpp>

#include "KilnRegulator.h"

MAX6675 thermocouple(/*thermoCLK*/6, /*thermoCS*/5, /*thermoDO*/4);

KilnRegulator kilnRegulator(thermocouple);

bool receiveMessage(Stream &stream) {
#if 0
	//zero out the data before checking
	//memset(&readData, sizeof(readData));

	size_t mapSize;
	msgpack::readMapSize(stream, mapSize);

	char key[100];
	size_t keyLength;
	size_t mm = sizeof(key);

	msgpack::readString(stream, key, keyLength, mm);
#endif
}

void sendState(KilnRegulator &kilnRegulator, Stream &stream) {
	size_t map_size = 5;

	int state =  kilnRegulator.getState();
	int elementState =  kilnRegulator.getElementState();
	int segment = kilnRegulator.getCurrentSegment();
	double temperature = kilnRegulator.getTemperature();
  
	msgpack::writeMapSize(stream, map_size);

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
}


void setup() {
	Serial.begin(115200);
	while (!Serial) continue;
	delay(500); // wait for MAX chip to stabilize
}

void loop() {
	if (Serial.available()) {
		receiveMessage(Serial);
	}
	kilnRegulator.updateState();
	sendState(kilnRegulator, Serial);
	delay(500);
}
