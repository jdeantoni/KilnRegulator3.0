# Arduino Make file. Refer to https://github.com/sudar/Arduino-Makefile


ARDUINO_LIBS = msgpack-arduino MAX6675-library Arduino-PID-Library Time
USER_LIB_PATH := src/
BOARD_TAG    = uno

LOCAL_C_SRCS    ?= $(wildcard src/kilnregulator/*.c)
LOCAL_CPP_SRCS  ?= $(wildcard src/kilnregulator/*.cpp)

include ${ARDMK_DIR}/Arduino.mk
