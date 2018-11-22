#ifndef _ERRORCODE_H_
#define _ERRORCODE_H_

struct ErrorCode {
	enum {
		TEMP_OUT_OF_BOUNDS,
		BAD_REQUEST,
		INVALID_STATE
	};
};

#endif //_ERRORCODE_H_
