#include "KilnRegulator.h"
#include "Segment.h"
#include "Time.h"

KilnRegulator::KilnRegulator(MAX6675 &thermocouple, int outputPin) : thermocouple(thermocouple),
	pid(&temperature, &output, &setpoint, consKp, consKi, consKd, DIRECT),
	outputPin(outputPin) {
}

void KilnRegulator::init() {
	pinMode(outputPin, OUTPUT);
	digitalWrite(outputPin, LOW);
	pid.SetMode(AUTOMATIC);
	//pid.SetOutputLimits(0, windowSize);
}

double KilnRegulator::computeSetPoint() {
	if (program == nullptr) {
		return -1;
	}
	double setPoint = 0;
	if (currentSegmentStartDate + program->segments[currentSegment].duration < now()) { // first segment time elapsed, go to next segment
		 currentSegment++;
		 currentSegmentStartDate = now();
	}
	if (currentSegment >= program->count) { // finished
		stop();
	}
	double temperature = program->segments[currentSegment].temperature;
	double slope = program->segments[currentSegment].slope;
	if (currentSegment > 0) { // not first segment so start from previous temp
		setPoint += program->segments[currentSegment - 1].temperature;
	}
	setPoint += program->segments[currentSegment].slope * (now() - currentSegmentStartDate); // current position on the curve y = time * slope
	if (slope >= 0.0 && setPoint > temperature) { // reached max temperature for this segment that has positive slope
		setPoint = temperature;
	}
	if (slope <= 0.0 && setPoint < temperature) { // reached min temperature for this segment that has negative slope
		setPoint = temperature;
	}
	return setPoint;
}

void KilnRegulator::regulate() {
	setpoint = computeSetPoint();

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
	if (/*setpoint > -1 && */state == KilnState::RUNNING)
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

int KilnRegulator::start(const Program &program) {

	if (state == KilnState::RUNNING) {
		return ErrorCode::INVALID_STATE;
	}
	/*if (setpoint < 0) {
		return ErrorCode::INVALID_STATE;
	}*/
	if  (program.count < 1) {
		return ErrorCode::INVALID_STATE;
	}
	//digitalWrite(13, HIGH);
	this->program = &program;
	state = KilnState::RUNNING;

	currentSegment = 0;
	startDate = now();
	currentSegmentStartDate = now();

	return 0;
}

int KilnRegulator::stop() {
	if (state != KilnState::RUNNING) {
		return ErrorCode::INVALID_STATE;
	}
	digitalWrite(outputPin, LOW);
	digitalWrite(13, LOW);

	endDate = now();

	state = KilnState::STOPPED;
	windowStartTime = 0;
	return 0;
}

int KilnRegulator::setSetpoint(double setpoint) {
	if (setpoint < 0 || setpoint > 2048) return ErrorCode::TEMP_OUT_OF_BOUNDS;
	this->setpoint = setpoint;
	return 0;
}
