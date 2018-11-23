FROM debian:stable-slim

ENV ARDUINO_DIR=/arduino-1.8.7 ARDMK_DIR=/Arduino-Makefile-1.6.0 PATH="${PATH}:/arduino-1.8.7"

RUN apt update && apt install -y wget xz-utils make git python python-serial

RUN wget -q -O- https://downloads.arduino.cc/arduino-1.8.7-linuxarm.tar.xz | tar xJC /
RUN wget -q -O- https://github.com/sudar/Arduino-Makefile/archive/1.6.0.tar.gz | tar xzC /

COPY . . # copy parent directory since it's run with parent docker-compose. Required to get .git for submodules

WORKDIR /arduino

RUN git submodule update --init
RUN make

CMD [ "make", "upload" ]
