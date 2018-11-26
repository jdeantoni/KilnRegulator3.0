#include "KilnRegulator.h"

KilnRegulator::KilnRegulator(MAX6675 &thermocouple, int outputPin) : thermocouple(thermocouple), outputPin(outputPin),
	pid(&temperature, &output, &setpoint, consKp, consKi, consKd, DIRECT) {
}

void KilnRegulator::init() {
	pinMode(outputPin, OUTPUT);
	digitalWrite(outputPin, LOW);
	pid.SetMode(AUTOMATIC);
	//pid.SetOutputLimits(0, windowSize);
}

void KilnRegulator::regulate() {
	double gap = abs(setpoint-temperature); //distance away from setpoint
	if (gap < 10) //we're close to setpoint, use conservative tuning parameters
		pid.SetTunings(consKp, consKi, consKd);
	else //we're far from setpoint, use aggressive tuning parameters
		pid.SetTunings(aggKp, aggKi, aggKd);
	pid.Compute();

	// do something with output
	unsigned long now = millis();
	if (windowStartTime == 0) {
		windowStartTime = millis();
	}
	if (now - windowStartTime > windowSize) { //time to shift the Relay Window
		windowStartTime += windowSize;
	}
	if (windowSize * output / 255  > now - windowStartTime) {
		digitalWrite(outputPin, HIGH);
		digitalWrite(13, HIGH);
	} else {
		digitalWrite(outputPin, LOW);
		digitalWrite(13, LOW);
	}
}

void KilnRegulator::updateState() {
	temperature = thermocouple.readCelsius();
	if (setpoint > -1 && state == KilnState::RUNNING)
		regulate();
}

double KilnRegulator::getTemperature() const {
	return temperature;
}

int KilnRegulator::getState() const {
	return state;
}

int KilnRegulator::getElementState() const {
	return elementState;
}

int KilnRegulator::getCurrentSegment() const {
	return currentSegment;
}

int KilnRegulator::start() {
	if (state == KilnState::RUNNING) {
		return ErrorCode::INVALID_STATE;
	}
	if (setpoint < 0) {
		return ErrorCode::INVALID_STATE;
	}
	//digitalWrite(13, HIGH);
	state = KilnState::RUNNING;
	return 0;
}

int KilnRegulator::stop() {
	if (state != KilnState::RUNNING) {
		return ErrorCode::INVALID_STATE;
	}
	digitalWrite(outputPin, LOW);
	digitalWrite(13, LOW);

	state = KilnState::STOPPED;
	windowStartTime = 0;
	return 0;
}

int KilnRegulator::setSetpoint(double setpoint) {
	if (setpoint < 0 || setpoint > 2048) return ErrorCode::TEMP_OUT_OF_BOUNDS;
	this->setpoint = setpoint;
	return 0;
}
