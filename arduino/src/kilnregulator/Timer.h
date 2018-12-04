#ifndef _TIMER_H_
#define _TIMER_H_

class Timer {
public:
	Timer(unsigned long);
	void start(unsigned long);
	void update(unsigned long);
	bool expired() const;
private:
	unsigned long timeout = 0;
	unsigned long startMillis = 0;
	bool m_expired = true;
};

#endif//_TIMER_H_

