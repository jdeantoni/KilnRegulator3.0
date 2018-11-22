#ifndef _KILNSTATE_H_
#define _KILNSTATE_H_

struct KilnState {
	enum {
		READY,
		RUNNING,
		STOPPED,
		ERROR
	};
};
#endif //_KILNSTATE_H_
