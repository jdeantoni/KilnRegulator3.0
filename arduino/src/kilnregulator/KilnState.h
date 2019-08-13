#ifndef _KILNSTATE_H_
#define _KILNSTATE_H_

struct KilnState {
	enum {
		READY,
		RUNNING,
		STOPPED,
		ERROR,
		DELAYED
	};
};
#endif //_KILNSTATE_H_
