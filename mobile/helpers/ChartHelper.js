import {DURATION, SLOPE, TABLE_KEYS, TARGET_TEMPERATURE, TEMP_ORIGIN, TIME_ORIGIN, IS_FULL} from "./Constants";
import {getDurationFromTempAndSlope, getTempFromDurationAndSlope} from "./UnitsHelper";
import colors from "../styles/colors";


export function segmentsToChart(segments) {
    // console.log("segmentsToCharts....")
    let chartData = [{time: TIME_ORIGIN, temperature: TEMP_ORIGIN, isFull : false}];
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
        if ((segments[i].length < 2)) {
            continue;
        }

             
        //create point
        if (segments[i][IS_FULL]) {
            chartData[chartData.length] = {
                time: timeWithSlope + lastTime,
                temperature: segTemp,
                isFull : true
            };
        }else if (!Number.isNaN(segDuration) && !Number.isNaN(segTemp)){
            chartData[chartData.length] = {time: lastTime + segDuration, temperature: segTemp,
                isFull : false
            }
        }
    }
    // console.log("chartData", chartData)
    return chartData;
}

export function keepOnlyFullSegments(computedData){
    // console.log("keepOnlyFullSegments...")
    let resData = [];
    var prevPoint = computedData[0];
    for (const i in computedData) {
        if (computedData[i].isFull)
        {
            resData[resData.length] = prevPoint;
            resData[resData.length] = computedData[i];
        }
        prevPoint = computedData[i];
    }
    // console.log("resData ",resData)
    return resData;
}

function hasProperty(object, properties) {
    for (let i in properties) {
        if (!object.hasOwnProperty(properties[i])) {
            return false;
        }
    }
    return true;
}