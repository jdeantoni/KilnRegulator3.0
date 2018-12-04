#include "WatchDog.h"

void WatchDog::init(uint8_t timeout) {
	wdt_enable(timeout);
}

void WatchDog::update() {
	wdt_reset();
}
