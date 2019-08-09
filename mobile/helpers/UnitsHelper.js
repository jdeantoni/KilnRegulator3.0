import {DURATION, ID, SLOPE, TARGET_TEMPERATURE, TEMP_ORIGIN} from "./Constants";

/**
 * print a format H:MM from a float in hour
 * @param {*} fhour: a float representation of a duration in hour
 */
export function prettyPrintDuration(fhour){
    console.log("prettyPrintDuration :", fhour)
    if (fhour === undefined){ return ''}
    var ihour = Math.trunc(fhour)
    var iminutes = Math.fround((fhour-ihour)*60)
    if (iminutes < 10){
         return ihour+'h0'+iminutes
    }else{
         return ihour+'h'+iminutes
    }
}

export function unitToUser(segments) {
    if (segments === null) return null;
    console.log("unitToUser() ... segments", JSON.stringify(segments))
    let newSegments = JSON.parse(JSON.stringify(segments));

    for (let i in segments) {
        if (segments[i].hasOwnProperty(DURATION)) {
            newSegments[i][DURATION] = segments[i][DURATION] / 3600;
        }
        if (segments[i].hasOwnProperty(SLOPE)) {
            newSegments[i][SLOPE] = segments[i][SLOPE] * 3600;
        }
    }

    return newSegments;
}

/**
 * used for serialization in seconds.. mainly in editProgram...
 * @param  segments 
 */
export function unitToDev(segments) {
    if (segments === null) return null;
    console.log("unitToDev() ... segments", JSON.stringify(segments))
    let newSegments = JSON.parse(JSON.stringify(segments));
    for (let i in newSegments) {
        if (segments[i].hasOwnProperty(DURATION)) {
            newSegments[i][DURATION] *= 3600;
        }
        if (segments[i].hasOwnProperty(SLOPE)) {
            newSegments[i][SLOPE] /= 3600
        }
        if (segments[i].hasOwnProperty(ID)) {
            delete newSegments[i][ID];
        }
    }

    return newSegments;
}

export function estimateTimeInSecondsForAllSegments(segments) {
    let timeInSeconds = 0;
    for (let i in segments) {
        timeInSeconds += estimateTimeInSecondsForSegment(segments, parseInt(i));
    }
    return timeInSeconds;
}

export function estimateTimeInSecondsForSegment(segments, segmentNumber) {
    const segment = segments[segmentNumber];
    if (segment.hasOwnProperty(DURATION)) {
        return segment[DURATION];
    } else if (segment.hasOwnProperty(TARGET_TEMPERATURE) && segment.hasOwnProperty(SLOPE)) {
        const lastTemp = (segmentNumber === 0) ? 0 : segments[segmentNumber-1][TARGET_TEMPERATURE];
        return Math.abs(segment[TARGET_TEMPERATURE] - lastTemp) / segment[SLOPE];
    }
}

export function secondsToUser(timeInSeconds) {
    if (timeInSeconds <= 0) {
        return "0s";
    }

    const hours = Math.floor(timeInSeconds / 3600);
    let minutes = Math.floor((timeInSeconds - (hours * 3600)) / 60);

    if (hours === 0) {
        return minutes + "min";
    } else {
        if (minutes < 10) { minutes = "0" + minutes }
        return hours + "h" + minutes;
    }
}

export function hoursToHoursAndMinutes(hours) {
    let realHours = Math.trunc(hours);
    let minutes = Math.floor((hours - realHours) * 60);

    if (minutes === 60 || minutes === 0) {
        if (minutes === 60) realHours++;
        return realHours + "h";
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    return realHours + "h" + minutes;
}

export function isoDateToUser(isoDate) {
    const date = new Date(isoDate);
    return date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
}

export function completeIsoDateToUser(isoDate) {
    const date = new Date(isoDate);
    let minutes = date.getMinutes();
    if (minutes < 10) minutes = "0" + minutes;
    return date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear() + " à " + date.getHours() + "h" + minutes;
}

export function getDurationFromTempAndSlope(targetTemperature, lastTemperature, slope) {
    return Math.abs(targetTemperature - lastTemperature) / Math.abs(slope);
}

export function getTempFromDurationAndSlope(duration, slope) {
    return parseFloat(duration) * slope;
}
