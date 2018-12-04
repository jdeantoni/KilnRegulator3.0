#include "Timer.h"

Timer::Timer(unsigned long timeout) : timeout(timeout) {
}

void Timer::start(unsigned long millis) {
	startMillis = millis;
	m_expired = false;
}

void Timer::update(unsigned long newMillis) {
	if (!m_expired && startMillis + timeout <= newMillis) { // expired
		m_expired = true;
	}
}

bool Timer::expired() const {
	return m_expired;
}
