#include "LCDMonitor.h"

#include <Time.h>
#include "KilnState.h"

LCDMonitor::LCDMonitor(int8_t cs, int8_t dc, int8_t rst) : tft(cs, dc, rst) {
}

void LCDMonitor::init() {
	tft.initR(options); // Init ST7735R chip, green tab
}

void LCDMonitor::draw(const KilnRegulator &kr) {
	static int first = 0;
	char strbuf[12];
    unsigned long  kilnStartDate = kr.getStartDate();
    int hours = 0;
    int minutes = 0;
    if (kilnStartDate != 0){
        unsigned long seconds = now() - kilnStartDate;
        hours = seconds / 3600;
        minutes = (seconds / 60) % 60;
    }
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

    if (kr.getState() == KilnState::READY){
        tft.println("\n");
        tft.setTextColor(ST77XX_BLUE);
        tft.println(" READY ");
        tft.setTextSize(4);
    }else if (kr.getState() == KilnState::DELAYED){
        tft.setTextSize(2);
	tft.setTextColor(ST77XX_RED);
        tft.println(" DELAYED \n");
	tft.setTextColor(ST77XX_BLACK);
	tft.setTextSize(1);
	tft.println("start cooking in\n");
	tft.print("  ");
	tft.setTextSize(2);
	unsigned int secondesBeforeCooking = ((kr.getWakeupDate() - now()));
	unsigned int minutesBeforeCooking = (unsigned int)(secondesBeforeCooking/60);
	minutesBeforeCooking++;
	tft.setTextColor(ST77XX_RED);
	tft.print(minutesBeforeCooking);
	tft.setTextColor(ST77XX_BLACK);
	tft.println(" min");
        tft.setTextSize(4);
    }else{
        tft.setTextSize(1);
        tft.println("");
        tft.println("Temperature cible:");
        tft.setTextSize(2);
        snprintf(strbuf, 11, "%8d C", setpoint);
        tft.println(strbuf);
        tft.setTextSize(1);

        tft.println("");
        if(kr.getState() == KilnState::STOPPED){
		tft.setTextColor(ST77XX_GREEN);
		tft.println("Cuisson finie :)");
	}else{
		tft.println("Temps ecoule:");
		tft.setTextSize(2);
		snprintf(strbuf, 11, "%7dh%d", hours, minutes);
		tft.println(strbuf);
		tft.setTextSize(1);
		tft.println("");
		tft.setTextSize(2);
		switch (elementState) {
		    case ElementState::HEATING:
			tft.setTextColor(ST77XX_RED);
			tft.println("  chauffe");
			if(kr.getSegmentKind() == SegmentKind::FULL){
				tft.setTextSize(1);
				tft.println("  a fond :)");
			}
			break;
		    case ElementState::STALE:
			tft.setTextColor(ST77XX_BLACK);
			tft.println("  repos");
			break;
		    case ElementState::COOLING:
			tft.setTextColor(ST77XX_BLUE);
			tft.println("  refroidit");
			break;
		}
	}
    }
}
