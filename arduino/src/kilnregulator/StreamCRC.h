#include <util/crc16.h>
#include <HardwareSerial.h>

class StreamCRC : public Stream {
public:
	StreamCRC(Stream &stream) : stream(stream) {};

	virtual int available(void) { return stream.available(); }
	virtual int peek(void) { return stream.peek(); }
	virtual int read(void) {
		int c = stream.read();
		crcCur = _crc8_ccitt_update(crcCur, c); // crc8-ccitt compatible with NodeJS's crc8
		return c;
	}
	virtual int availableForWrite(void) { return stream.availableForWrite(); }
	virtual void flush(void) { return stream.flush(); }
	virtual size_t write(uint8_t c) { return stream.write(c); }

	void resetCRC() { crcCur = 0; }
	int getCRC() { return crcCur; }

private:
	Stream &stream;

	uint8_t crcCur = 0;
};
