#include "LCDMonitor.h"

#include <Time.h>

LCDMonitor::LCDMonitor(int8_t cs, int8_t dc, int8_t rst) : tft(cs, dc, rst) {
}

void LCDMonitor::init() {
	tft.initR(options); // Init ST7735R chip, green tab
}

void LCDMonitor::draw(const KilnRegulator &kr) {
	static int first = 0;
	char strbuf[12];
	unsigned long seconds = now() - kr.getStartDate();
	int hours = seconds / 3600;
	int minutes = (seconds / 60) % 60;
	int temperature = kr.getTemperature();
	int setpoint = kr.setpoint;
	uint8_t elementState = kr.getElementState();

	tft.setCursor(0, 0);
	tft.fillScreen(ST77XX_WHITE);
	tft.setTextWrap(true);
	tft.setTextColor(ST77XX_BLACK);
	tft.setTextSize(1);

	tft.println("Temperature:");
	tft.setTextSize(3);
	snprintf(strbuf, 11, "%5d C", temperature);
	tft.println(strbuf);
	tft.setTextSize(1);

	tft.println("");
	tft.println("Temperature cible:");
	tft.setTextSize(2);
	snprintf(strbuf, 11, "%8d C", setpoint);
	tft.println(strbuf);
	tft.setTextSize(1);

	tft.println("");
	tft.println("Temps écoulé:");
	tft.setTextSize(2);
	snprintf(strbuf, 11, "%7dh%d", hours, minutes);
	tft.println(strbuf);
	tft.setTextSize(1);

	tft.println("");
	tft.setTextSize(2);
	switch (elementState) {
		case ElementState::HEATING:
			tft.setTextColor(ST77XX_RED);
			tft.println("  Heating");
			break;
		case ElementState::STALE:
			tft.setTextColor(ST77XX_BLACK);
			tft.println("   Stale");
			break;
		case ElementState::COOLING:
			tft.setTextColor(ST77XX_BLUE);
			tft.println("  Cooling");
			break;
	}
}
