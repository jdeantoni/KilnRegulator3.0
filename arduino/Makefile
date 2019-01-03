# Arduino Make file. Refer to https://github.com/sudar/Arduino-Makefile


ARDUINO_LIBS = msgpack-arduino MAX6675-library Arduino-PID-Library Time Arduino/libraries/IEEE754tools SPI Adafruit-MAX31855-library Adafruit_MAX31856 Adafruit-ST7735-Library Adafruit-GFX-Library
USER_LIB_PATH := src/
BOARD_TAG    = uno

LOCAL_C_SRCS    ?= $(wildcard src/kilnregulator/*.c)
LOCAL_CPP_SRCS  ?= $(wildcard src/kilnregulator/*.cpp)

include src/Arduino-Makefile/Arduino.mk
