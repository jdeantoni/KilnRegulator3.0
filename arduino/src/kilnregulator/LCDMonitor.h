#ifndef _LCDMONITOR_H_
#define _LCDMONITOR_H_

#include <Adafruit_ST7735.h>

#include "KilnRegulator.h"

class LCDMonitor {
public:
	LCDMonitor(int8_t cs, int8_t dc, int8_t rst);
	void init();
	void draw(const KilnRegulator&);

private:
	Adafruit_ST7735 tft;

	const uint8_t options = INITR_144GREENTAB; //default ST77xx LCD type, 1.44" chinese module
};

#endif//_LCDMONITOR_H_
