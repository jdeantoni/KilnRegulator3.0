#include <max6675.h>

#include <msgpck.h>


#include "msgpack.hpp"

MAX6675 thermocouple(/*thermoCLK*/6, /*thermoCS*/5, /*thermoDO*/4);


bool checkData(Stream &stream) {
    //zero out the data before checking
    //memset(&readData, sizeof(readData));

    size_t mapSize;
    msgpack::readMapSize(stream, mapSize);

    char key[100];
    size_t keyLength;
    size_t mm = sizeof(key);

    msgpack::readString(stream, key, keyLength, mm);

//    checkRoot(stream);
}

void sendTemp(Stream &stream) {
  size_t map_size = 1;
  float values;
  values = thermocouple.readCelsius();

  
  msgpack::writeMapSize(stream, map_size);
  msgpack::writeString(stream, "temperature");
  msgpack::writeFloat32(stream, values);
  
   delay(500);
}

void setup() {
  Serial.begin(115200);
  while (!Serial) continue;
  delay(500); // wait for MAX chip to stabilize
}

void loop() {
  //if (Serial.available()) {
    //Serial.println("Received!");
    checkData(Serial);
    sendTemp(Serial);

  //}
}
