#ifndef _WATCHDOG_H_
#define _WATCHDOG_H_

#include <avr/wdt.h>

class WatchDog {
public:
	void init(uint8_t timeout = WDTO_8S); // 8s timeout by default to keep some marging. No need to restart quickly
	void update();
};

#endif//_WATCHDOG_H_
