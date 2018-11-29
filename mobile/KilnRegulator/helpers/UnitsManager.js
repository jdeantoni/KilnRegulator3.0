const DURATION = "duration";
const SLOPE = "slope";
const ID = "_id";

export function unitToUser(segments) {
    let newSegments = JSON.parse(JSON.stringify(segments));

    for (let i = 0; i < segments.length; i++) {
        if (segments[i].hasOwnProperty(DURATION)) {
            newSegments[i][DURATION] = segments[i][DURATION] / 3600;
        }
        if (segments[i].hasOwnProperty(SLOPE)) {
            newSegments[i][SLOPE] = segments[i][SLOPE] * 3600;
        }
    }

    return newSegments;
}

export function unitToDev(segments) {
    for (let i = 0; i < segments.length; i++) {
        if (segments[i].hasOwnProperty(DURATION)) {
            segments[i][DURATION] *= 3600;
        }
        if (segments[i].hasOwnProperty(SLOPE)) {
            segments[i][SLOPE] /= 3600
        }
        if (segments[i].hasOwnProperty(ID)) {
            delete segments[i][ID];
        }
    }

    return segments;
}