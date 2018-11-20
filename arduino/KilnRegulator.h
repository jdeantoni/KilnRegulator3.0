#ifndef _KILNREGULATOR_H_
#define _KILNREGULATOR_H_

#include <max6675.h>

#include "ElementState.h"
#include "KilnState.h"

class KilnRegulator {
public:
	KilnRegulator(MAX6675&);

	void updateState();
	double getTemperature() const;
	int getState() const;
	int getElementState() const;
	int getCurrentSegment() const;
private:
	double temperature = 0.0;
	int state = KilnState::READY;
	int elementState = ElementState::STALE;
	int currentSegment = -1;

	MAX6675 &thermocouple;
};

#endif //_KILNREGULATOR_H_
