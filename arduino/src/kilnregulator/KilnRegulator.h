#ifndef _KILNREGULATOR_H_
#define _KILNREGULATOR_H_

#include <max6675.h>
#include <PID_v1.h>

#include "ElementState.h"
#include "KilnState.h"
#include "ErrorCode.h"

class KilnRegulator {
public:
	KilnRegulator(MAX6675&);
	void init();

	void updateState();
	double getTemperature() const;
	int getState() const;
	int getElementState() const;
	int getCurrentSegment() const;

	int start();
	int stop();
	int setSetpoint(double);
	double output = 0.0;
private:
	double temperature = 0.0;
	int state = KilnState::READY;
	int elementState = ElementState::STALE;
	int currentSegment = -1;

	double setpoint = -1.0;
	unsigned long windowSize = 5000;
	unsigned long windowStartTime = 0;

	MAX6675 &thermocouple;
	PID pid;

	void regulate();

	double aggKp=4, aggKi=0.2, aggKd=1;
	double consKp=1, consKi=0.05, consKd=0.25;

};

#endif //_KILNREGULATOR_H_
