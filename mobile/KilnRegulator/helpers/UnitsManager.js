import {TARGET_TEMPERATURE} from "./Constants";

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

export function computeTimeFromSegments(segments) {
    let timeInSeconds = 0;
    for (let i in segments) {
        if (segments[i].hasOwnProperty(DURATION)) {
            timeInSeconds += segments[i][DURATION];
        } else if (segments[i].hasOwnProperty(TARGET_TEMPERATURE) && segments[i].hasOwnProperty(SLOPE)) {
            const lastTemp = (i === "0") ? 0 : segments[parseInt(i)-1][TARGET_TEMPERATURE];
            timeInSeconds += Math.abs(segments[i][TARGET_TEMPERATURE] - lastTemp) / segments[i][SLOPE];
        }
    }

    const hours = Math.floor(timeInSeconds / 3600);
    let minutes = Math.floor((timeInSeconds - (hours * 3600)) / 60);
    if (minutes < 10) { minutes = "0" + minutes }

    return hours + "h" + minutes + "min";
}

export function hoursToHoursAndMinutes(hours) {
    let realHours = Math.trunc(hours);
    let minutes = Math.floor((hours - realHours) * 60);
    if (minutes === 60 || minutes === 0) {
        if (minutes === 60) {
            realHours++;
        }
        return realHours + "h";
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    return realHours + "h" + minutes + "m";
}

export function isoDateToUser(date) {
    return date.split("T")[0];
}

export function getDurationFromTempAndSlope(targetTemperature, lastTemperature, slope) {
    return Math.abs(targetTemperature - lastTemperature) / Math.abs(slope);
}

export function getTempFromDurationAndSlope(duration, slope) {
    return parseFloat(duration) * Math.abs(slope);
}