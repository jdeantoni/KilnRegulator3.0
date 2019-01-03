import {DURATION, SLOPE, TABLE_KEYS, TARGET_TEMPERATURE, TEMP_ORIGIN, TIME_ORIGIN} from "./Constants";
import {getDurationFromTempAndSlope, getTempFromDurationAndSlope} from "./UnitsHelper";

export default function segmentsToChart(segments) {
    let chartData = [{time: TIME_ORIGIN, temperature: TEMP_ORIGIN}];
    let temp = 0;
    let time = 0;
    let segDuration;
    let segTemp;
    let segSlope;
    let lastTemp;
    let lastTime;
    let timeWithSlope;
    let tempWithSlope;
    for (const i in segments) {
        //set segment vars
        segDuration = parseFloat(segments[i][DURATION]);
        segTemp = parseFloat(segments[i][TARGET_TEMPERATURE]);
        segSlope = parseFloat(segments[i][SLOPE]);
        lastTemp = chartData[chartData.length-1].temperature;
        lastTime = chartData[chartData.length-1].time;
        timeWithSlope = getDurationFromTempAndSlope(segTemp, lastTemp, segSlope);
        tempWithSlope = getTempFromDurationAndSlope(segDuration, segSlope);

        //check properties
        for (let key in segments[i]) {
            if (segments[i][key] === "") {
                delete segments[i][key];
            }
        }
        if ((segments[i].length < 2) || (segSlope === 0 && lastTemp !== segTemp)) {
            continue;
        }

        //compute time
        if (hasProperty(segments[i],[DURATION])) {
            time += segDuration;
        } else {
            time += timeWithSlope;
        }

        //compute temperature
        if (hasProperty(segments[i],[TARGET_TEMPERATURE])) {
            temp = segTemp;
        } else {
            temp += tempWithSlope;
        }

        //add plateau if necessary
        if (hasProperty(segments[i], TABLE_KEYS)) {
            //horizontal segment
            if (timeWithSlope < segDuration) {
                chartData[chartData.length] = {
                    time: timeWithSlope + lastTime,
                    temperature: temp
                };
            }
            //vertical segment
            else if (timeWithSlope > segDuration) {
                chartData[chartData.length] = {
                    time: time,
                    temperature: tempWithSlope + lastTemp
                };
            }
        }

        //create point
        if (!Number.isNaN(time) && !Number.isNaN(temp)) {
            chartData[chartData.length] = {time: time, temperature: temp};
        }
    }
    return chartData;
}

function hasProperty(object, properties) {
    for (let i in properties) {
        if (!object.hasOwnProperty(properties[i])) {
            return false;
        }
    }
    return true;
}