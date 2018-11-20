#include "KilnRegulator.h"

KilnRegulator::KilnRegulator(MAX6675 &thermocouple) : thermocouple(thermocouple) {
}

void KilnRegulator::updateState() {
	temperature = thermocouple.readCelsius();
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
