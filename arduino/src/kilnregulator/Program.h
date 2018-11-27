#ifndef _PROGRAM_H_
#define _PROGRAM_H_

#include "Segment.h"

struct Program {
	static const int MAX_SEGMENT_COUNT = 12;

	Segment segments[MAX_SEGMENT_COUNT];
	int count = 0;
};

#endif//_PROGRAM_H_
