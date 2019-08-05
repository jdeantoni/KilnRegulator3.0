#ifndef _KILNREGULATOR_H_
#define _KILNREGULATOR_H_

#include <Adafruit_MAX31856.h>
#include <PID_v1.h>

#include "Program.h"
#include "ElementState.h"
#include "KilnState.h"
#include "ErrorCode.h"

class KilnRegulator {
public:
	KilnRegulator(Adafruit_MAX31856&, int);
	void init();

	void updateState();
	double getTemperature() const;
	uint8_t getState() const;
	void setState(uint8_t);
	uint8_t getElementState() const;
	int8_t getCurrentSegment() const;
	unsigned long getStartDate() const;

	int start(const Program &program);
	int stop();
	int reset();
	int setSetpoint(double);
	double output = 0.0;
	double setpoint = -1.0;
private:
	double temperature = 0.0;
	uint8_t state = KilnState::READY;
	uint8_t elementState = ElementState::STALE;
	int8_t currentSegment = -1;

	unsigned long windowSize = 60000;
	unsigned long windowStartTime = 0;

	Adafruit_MAX31856 &thermocouple;
	PID pid;

	void regulate();
	double computeSetPoint();
	unsigned long startDate = 0;
	unsigned long currentSegmentStartDate = 0;
	unsigned long endDate = 0;

	double aggKp=6, aggKi=0.3, aggKd=1;
	double consKp=3, consKi=0.1, consKd=0.3;

	int outputPin = -1;

	const Program *program = nullptr;
};

#endif //_KILNREGULATOR_H_
