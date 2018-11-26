#ifndef _SEGMENT_H_
#define _SEGMENT_H_

struct Segment {
	double temperature;
	double slope;
	unsigned long duration;
};

const int SEGMENT_COUNT = 2;

Segment segments[SEGMENT_COUNT] = {
	{20.0, 0.16666666666, 100UL},
	{100.0, 0.33333333333, 100UL}
};

#endif//_SEGMENT_H_

