import { displayGraph } from "./chartHelper.js";
import {KilnStates} from "./model/kilnState.js"

var actualKilnTemp = "loading"
var maxHeatingSlope = 120
var kilnState =KilnStates.READY
export var currentProgram = {}
var isDirty = false



var state = "IDLE";
var state_last = "";
var graph = [ 'profile', 'live'];
var points = [];
var profiles = [];
var time_mode = 0;
var selected_profile = 0;
var selected_profile_name = 'cone-05-long-bisque.json';
var temp_scale = "c";
var time_scale_slope = "s";
var time_scale_profile = "s";
var time_scale_long = "Seconds";
var temp_scale_display = "C";
var kwh_rate = 0.26;
var currency_type = "EUR";

var host = "ws://" + window.location.hostname + ":" + window.location.port;
var ws_status = new WebSocket(host+"/status");
var ws_control = new WebSocket(host+"/control");
var ws_config = new WebSocket(host+"/config");
var ws_storage = new WebSocket(host+"/storage");


if(window.webkitRequestAnimationFrame) window.requestAnimationFrame = window.webkitRequestAnimationFrame;



// graph.profile =
// {
//     label: "Profile",
//     data: [],
//     points: { show: false },
//     color: "#75890c",
//     draggable: false
// };

// graph.live =
// {
//     label: "Live",
//     data: [],
//     points: { show: false },
//     color: "#d8d3c5",
//     draggable: false
// };


// function updateProfile(id)
// {
//     selected_profile = id;
//     selected_profile_name = profiles[id].name;
//     var job_seconds = profiles[id].data.length === 0 ? 0 : parseInt(profiles[id].data[profiles[id].data.length-1][0]);
//     var kwh = (3850*job_seconds/3600/1000).toFixed(2);
//     var cost =  (kwh*kwh_rate).toFixed(2);
//     var job_time = new Date(job_seconds * 1000).toISOString().substr(11, 8);
//     $('#sel_prof').html(profiles[id].name);
//     $('#sel_prof_eta').html(job_time);
//     $('#sel_prof_cost').html(kwh + ' kWh ('+ currency_type +': '+ cost +')');
//     graph.profile.data = profiles[id].data;
//     graph.plot = $.plot("#graph_container", [ graph.profile, graph.live ] , getOptions());
// }

// function deleteProfile()
// {
//     var profile = { "type": "profile", "data": "", "name": selected_profile_name };
//     var delete_struct = { "cmd": "DELETE", "profile": profile };

//     var delete_cmd = JSON.stringify(delete_struct);
//     console.log("Delete profile:" + selected_profile_name);

//     ws_storage.send(delete_cmd);

//     ws_storage.send('GET');
//     selected_profile_name = profiles[0].name;

//     state="IDLE";
//     $('#edit').hide();
//     $('#profile_selector').show();
//     $('#btn_controls').show();
//     $('#status').slideDown();
//     $('#profile_table').slideUp();
//     $('#e2').select2('val', 0);
//     graph.profile.points.show = false;
//     graph.profile.draggable = false;
//     graph.plot = $.plot("#graph_container", [ graph.profile, graph.live ], getOptions());
// }


// function updateProgress(percentage)
// {
//     if(state=="RUNNING")
//     {
//         if(percentage > 100) percentage = 100;
//         $('#progressBar').css('width', percentage+'%');
//         if(percentage>5) $('#progressBar').html(parseInt(percentage)+'%');
//     }
//     else
//     {
//         $('#progressBar').css('width', 0+'%');
//         $('#progressBar').html('');
//     }
// }

// function updateProfileTable()
// {
//     var dps = 0;
//     var slope = "";
//     var color = "";

//     var html = '<h3>Schedule Points</h3><div class="table-responsive" style="scroll: none"><table class="table table-striped">';
//         html += '<tr><th style="width: 50px">#</th><th>Target Time in ' + time_scale_long+ '</th><th>Target Temperature in °'+temp_scale_display+'</th><th>Slope in &deg;'+temp_scale_display+'/'+time_scale_slope+'</th><th></th></tr>';

//     for(var i=0; i<graph.profile.data.length;i++)
//     {

//         if (i>=1) dps =  ((graph.profile.data[i][1]-graph.profile.data[i-1][1])/(graph.profile.data[i][0]-graph.profile.data[i-1][0]) * 10) / 10;
//         if (dps  > 0) { slope = "up";     color="rgba(206, 5, 5, 1)"; } else
//         if (dps  < 0) { slope = "down";   color="rgba(23, 108, 204, 1)"; dps *= -1; } else
//         if (dps == 0) { slope = "right";  color="grey"; }

//         html += '<tr><td><h4>' + (i+1) + '</h4></td>';
//         html += '<td><input type="text" class="form-control" id="profiletable-0-'+i+'" value="'+ timeProfileFormatter(graph.profile.data[i][0],true) + '" style="width: 60px" /></td>';
//         html += '<td><input type="text" class="form-control" id="profiletable-1-'+i+'" value="'+ graph.profile.data[i][1] + '" style="width: 60px" /></td>';
//         html += '<td><div class="input-group"><span class="glyphicon glyphicon-circle-arrow-' + slope + ' input-group-addon ds-trend" style="background: '+color+'"></span><input type="text" class="form-control ds-input" readonly value="' + formatDPS(dps) + '" style="width: 100px" /></div></td>';
//         html += '<td>&nbsp;</td></tr>';
//     }

//     html += '</table></div>';

//     $('#profile_table').html(html);

//     //Link table to graph
//     $(".form-control").change(function(e)
//         {
//             var id = $(this)[0].id; //e.currentTarget.attributes.id
//             var value = parseInt($(this)[0].value);
//             var fields = id.split("-");
//             var col = parseInt(fields[1]);
//             var row = parseInt(fields[2]);
            
//             if (graph.profile.data.length > 0) {
//             if (col == 0) {
//                 graph.profile.data[row][col] = timeProfileFormatter(value,false);   
//             }
//             else {
//                 graph.profile.data[row][col] = value;
//             }
            
//             graph.plot = $.plot("#graph_container", [ graph.profile, graph.live ], getOptions());
//             }
//             updateProfileTable();

//         });
// }

// function timeProfileFormatter(val, down) {
//     var rval = val
//     switch(time_scale_profile){
//         case "m":
//             if (down) {rval = val / 60;} else {rval = val * 60;}
//             break;
//         case "h":
//             if (down) {rval = val / 3600;} else {rval = val * 3600;} 
//             break;
//     }
//     return Math.round(rval);
// }

// function formatDPS(val) {
//     var tval = val;
//     if (time_scale_slope == "m") {
//         tval = val * 60;    
//     }
//     if (time_scale_slope == "h") {
//         tval = (val * 60) * 60;
//     }
//     return Math.round(tval);
// }

// function hazardTemp(){
   
//     if (temp_scale == "f") {
//         return (1500 * 9 / 5) + 32
//     } 
//     else {
//         return 1500
//     }
// }

function timeValueToString(val)
{
        var hours = Math.floor(val / (60));
        var div_min = val % (60);
        var minutes = Math.floor(div_min);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}

        return hours+":"+minutes;
}

function stringToTimeValue(sVal)
{
    var hours = 0
    var minutes = NaN
    if(sVal.includes(':')){
        var tabTime = sVal.split(':')
        hours = parseInt(tabTime[0])
        minutes = parseInt(tabTime[1])
    }else{
        minutes = parseInt(sVal)
    }
    if (hours == NaN || minutes == NaN){
        return NaN
    }
    var timeInMinute = ((hours)*60)+(minutes)*1
    return timeInMinute;
}

// function runTask()
// {
//     var cmd =
//     {
//         "cmd": "RUN",
//         "profile": profiles[selected_profile]
//     }

//     graph.live.data = [];
//     graph.plot = $.plot("#graph_container", [ graph.profile, graph.live ] , getOptions());

//     ws_control.send(JSON.stringify(cmd));

// }

// function runTaskSimulation()
// {
//     var cmd =
//     {
//         "cmd": "SIMULATE",
//         "profile": profiles[selected_profile]
//     }

//     graph.live.data = [];
//     graph.plot = $.plot("#graph_container", [ graph.profile, graph.live ] , getOptions());

//     ws_control.send(JSON.stringify(cmd));

// }


// function abortTask()
// {
//     var cmd = {"cmd": "STOP"};
//     ws_control.send(JSON.stringify(cmd));
// }

// function enterNewMode()
// {
//     state="EDIT"
//     $('#status').slideUp();
//     $('#edit').show();
//     $('#profile_selector').hide();
//     $('#btn_controls').hide();
//     $('#form_profile_name').attr('value', '');
//     $('#form_profile_name').attr('placeholder', 'Please enter a name');
//     graph.profile.points.show = true;
//     graph.profile.draggable = true;
//     graph.profile.data = [];
//     graph.plot = $.plot("#graph_container", [ graph.profile, graph.live ], getOptions());
//     updateProfileTable();
// }

// function enterEditMode()
// {
//     state="EDIT"
//     $('#status').slideUp();
//     $('#edit').show();
//     $('#profile_selector').hide();
//     $('#btn_controls').hide();
//     console.log(profiles);
//     $('#form_profile_name').val(profiles[selected_profile].name);
//     graph.profile.points.show = true;
//     graph.profile.draggable = true;
//     graph.plot = $.plot("#graph_container", [ graph.profile, graph.live ], getOptions());
//     updateProfileTable();
// }

// function leaveEditMode()
// {
//     selected_profile_name = $('#form_profile_name').val();
//     ws_storage.send('GET');
//     state="IDLE";
//     $('#edit').hide();
//     $('#profile_selector').show();
//     $('#btn_controls').show();
//     $('#status').slideDown();
//     $('#profile_table').slideUp();
//     graph.profile.points.show = false;
//     graph.profile.draggable = false;
//     graph.plot = $.plot("#graph_container", [ graph.profile, graph.live ], getOptions());
// }

// function newPoint()
// {
//     if(graph.profile.data.length > 0)
//     {
//         var pointx = parseInt(graph.profile.data[graph.profile.data.length-1][0])+15;
//     }
//     else
//     {
//         var pointx = 0;
//     }
//     graph.profile.data.push([pointx, Math.floor((Math.random()*230)+25)]);
//     graph.plot = $.plot("#graph_container", [ graph.profile, graph.live ], getOptions());
//     updateProfileTable();
// }

// function delPoint()
// {
//     graph.profile.data.splice(-1,1)
//     graph.plot = $.plot("#graph_container", [ graph.profile, graph.live ], getOptions());
//     updateProfileTable();
// }

// function toggleTable()
// {
//     if($('#profile_table').css('display') == 'none')
//     {
//         $('#profile_table').slideDown();
//     }
//     else
//     {
//         $('#profile_table').slideUp();
//     }
// }

// function saveProfile()
// {
//     name = $('#form_profile_name').val();
//     var rawdata = graph.plot.getData()[0].data
//     var data = [];
//     var last = -1;

//     for(var i=0; i<rawdata.length;i++)
//     {
//         if(rawdata[i][0] > last)
//         {
//           data.push([rawdata[i][0], rawdata[i][1]]);
//         }
//         else
//         {
//           $.bootstrapGrowl("<span class=\"glyphicon glyphicon-exclamation-sign\"></span> <b>ERROR 88:</b><br/>An oven is not a time-machine", {
//             ele: 'body', // which element to append to
//             type: 'alert', // (null, 'info', 'error', 'success')
//             offset: {from: 'top', amount: 250}, // 'top', or 'bottom'
//             align: 'center', // ('left', 'right', or 'center')
//             width: 385, // (integer, or 'auto')
//             delay: 5000,
//             allow_dismiss: true,
//             stackup_spacing: 10 // spacing between consecutively stacked growls.
//           });

//           return false;
//         }

//         last = rawdata[i][0];
//     }

//     var profile = { "type": "profile", "data": data, "name": name }
//     var put = { "cmd": "PUT", "profile": profile }

//     var put_cmd = JSON.stringify(put);

//     ws_storage.send(put_cmd);

//     leaveEditMode();
// }

// function getOptions()
// {

//   var options =
//   {
//   }

//   return options;

// }















/**
 * funny, not used but could be on success cooking.
 */
function beep() {
    var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
    snd.play();
}

var actions='<a class="add" title="Add"><span data-feather="plus"></span></a>'+
            '<a class="edit" title="Edit"><span data-feather="edit"></span></a>'+
            '<a class="delete" title="Delete"><span data-feather="trash"></span></a>'


/**
 * 
 * @param {["isMax", "targetTemp", "duration", "slope"]} initialValues 
 */
function rowNew(position, initialValues){
    // var actions = $("table td:last-child").html();
    var table = document.getElementById("graphDataTable")
    $("#addNewRowButton").attr("disabled", "disabled");
    var index = table.rows.length;
    var isMax = false
    var targetTemp =""
    var duration = ""
    var slope = ""
    if(initialValues != undefined){
        console.log("initialValues: "+initialValues)
        if(!isNaN(position)){
            index = position*1+1
        }
        isMax = initialValues[0]
        targetTemp = initialValues[1]
        duration = initialValues[2]
        slope = initialValues[3]
    }
    var isMaxTr = '<td><input type="checkbox" class="form-control" name="max" id="max" placeholder="false" value="off"></td>'
    if(isMax){
        isMaxTr = '<td><input type="checkbox" class="form-control" name="max" id="max" placeholder="false" value="on" checked></td>'
    }
    var row = '<tr>' +
        '<td>'+index+'</td>' +
        isMaxTr +
        '<td><input type="number" class="form-control" name="targetTemp" id="targetTemp" placeholder="0°C" value="'+targetTemp+'"></td>' +
        '<td><input type="text" class="form-control without_ampm" name="duration" id="duration" placeholder="00:00" value="'+duration+'"></td>' +
        '<td><input type="number" class="form-control" name="slope" id="slope" placeholder="0" value="'+slope+'"></td>' +
        '<td>'  + actions+ '</td>' +
    '</tr>';
    if(isNaN(position)){
        $("#graphDataTable").append(row);
    }else{
        console.log(position)
        if(position ==0){
            $(row).insertBefore($("#graphDataTable > tbody > tr").eq(0));
        }else{
            $("#graphDataTable > tbody > tr:nth-child(" + (position) + ")").after(row)
        }
        
    }
   
    $("#graphDataTable input:checkbox")[0].onclick = resetAndManageRowValues
    $('#graphDataTable input[type="number"]')[0].onchange = manageRowValues
    $('#graphDataTable input[type="text"]')[0].onchange = manageRowValues
    $('#graphDataTable input[type="number"]')[1].onchange = manageRowValues
    $("#graphDataTable > tbody > tr:nth-child(" + (position) + ")").find('.edit').hide()
    $("#graphDataTable > tbody > tr:nth-child(" + (position) + ")").find('.delete').hide()
    $("#graphDataTable > tbody > tr:nth-child(" + (position) + ")").find('.add').show()

    feather.replace()
}

function resetAndManageRowValues(){
    if (!$("#graphDataTable input:checkbox")[0].checked){ //was checked and removed
        var timeInput = $('#graphDataTable input[type="time"]')[0]
        var slopeInput = $('#graphDataTable input[type="number"]')[1]
        timeInput.value =""
        slopeInput.value =""
        timeInput.readOnly = false
        slopeInput.readOnly = false
    }
    manageRowValues()
}



function manageRowValues(){
    var table = document.getElementById("graphDataTable")
    var isMax = $("#graphDataTable input:checkbox")[0].checked
    var targetTemp = $('#graphDataTable input[type="number"]')[0]
    var timeInput = $('#graphDataTable input[type="text"]')[0]
    var slopeInput = $('#graphDataTable input[type="number"]')[1]
    var index = $("#graphDataTable > tbody > tr").index($(targetTemp).parents("tr")[0])*1+1
    var previousTargetTemp = 25
    if(index > 1){
        var previousTargetTemp = table.rows[index-1].cells[2].innerText
    }
    timeInput.readOnly = false;
    slopeInput.readOnly = false;
    targetTemp.readOnly = false;
    if (isMax){
        $("#graphDataTable input:checkbox")[0].value="on"
        manageRowValuesMaxCase(targetTemp, timeInput, slopeInput, previousTargetTemp)
    }else{
        if(slopeInput.value == "" && targetTemp.value != "" && timeInput.value != ""){ //compute slope
            var timeInHour = stringToTimeValue(timeInput.value)/60
            console.log(targetTemp.value+" -  "+previousTargetTemp+"    /   "+timeInHour)
            slopeInput.value = Math.floor((targetTemp.value - previousTargetTemp) / timeInHour)
            slopeInput = true;
            $(slopeInput).addClass("grayout")
            return
        }
        if(slopeInput.value != "" && targetTemp.value == "" && timeInput.value != ""){ //compute slope
            var timeInHour = stringToTimeValue(timeInput.value)/60
            targetTemp.value =Number(previousTargetTemp) + Math.floor(Number(slopeInput.value) * Number(timeInHour))
            $(targetTemp).addClass("grayout")
            return
        }
        if(slopeInput.value != "" && targetTemp.value != "" && timeInput.value == ""){ //compute slope
            var segTimeInHour = Math.abs((targetTemp.value - previousTargetTemp))/slopeInput.value
            console.log("prevTarget: "+previousTargetTemp+"    segTime "+segTimeInHour+ "     dif " + (targetTemp.value - previousTargetTemp))
            timeInput.value= timeValueToString(segTimeInHour*60)
            $(timeInput).addClass("grayout")
            return;
        }
        //here all is already set but modification occurred
        $("#graphDataTable input:checkbox")[0].checked = false //since not in the max case
        
    }
}

function manageRowValuesMaxCase(targetTemp, timeInput, slopeInput, previousTargetTemp){
        console.log("previsous target temp: "+previousTargetTemp+ "     tt:"+targetTemp.value)
        if(targetTemp.value != ""){
            if (previousTargetTemp > parseInt(targetTemp.value)){
                alert("Max heating is not compatible with cooling... change target temperature")
                //$("#graphDataTable input:checkbox")[0].value = "off"
                return
            }
            slopeInput.value= maxHeatingSlope
            var segTimeInHour = Math.abs((targetTemp.value - previousTargetTemp))/maxHeatingSlope
            // console.log("segTime "+segTimeInHour+ "     dif " + (targetTemp.value - previousTargetTemp))
            // console.log(String(timeValueToString(segTimeInHour*3600)))
            timeInput.value=timeValueToString(segTimeInHour*60)
        }
        timeInput.readOnly = true;
        slopeInput.readOnly = true
}

function rowAdd(){
    var valid = true;
		var inputs = $(this).parents("tr").find('input');
        inputs.each(function(){
            if($(this).name == "duration" && stringToTimeValue($(this).val()) == NaN){
                $(this).addClass("error");
				valid = false;
            } else{
                $(this).removeClass("error");
            }
			if(!$(this).val()){
				$(this).addClass("error");
				valid = false;
			} else{
                $(this).removeClass("error");
            }
		});
        $(this).parents("tr").find(".error").first().focus();
		if(valid){
            for(var i = 0; i < inputs.length; i++){
                var input = inputs[i]
                if (i == 0){
                    console.log("input max  val="+ $(input).val()+"    isChecked:"+$(input).is(':checked'))
                    if($(input).is(':checked')){
                        $(input).parent("td").html('<span data-feather="check-square"></span>');
                        //gray out other tabs
                        $(inputs[2]).parent("td").addClass("grayout");
                        $(inputs[3]).parent("td").addClass("grayout");
                    }else{
                        $(input).parent("td").html('<span data-feather="square"></span>');
                    }
                    feather.replace();
                }else {
                    $(input).parent("td").html($(input).val());
                }
            }
            		
			$(this).parents("tr").find('.edit').show()
            $(this).parents("tr").find('.add').hide()
            $(this).parents("tr").find('.delete').show()
            $("#addNewRowButton").removeAttr("disabled");

            if(currentProgram.uuid != undefined){
                $("#saveButton").hide()
            }else{
                $("#saveButton").hide()
            }
            $("#saveAsButton").show()
            $("#deleteProgramButton").show()
            $("#startCookingButton").show()
            $("#delayedCookingButton").show()
            updateProgramFromGraphData()
            displayGraph(currentProgram);
        }	
        
        
}

function rowDelete(){
    $(this).parents("tr").remove()
    $("#graphDataTable > tbody > tr").each(function(i, tr){
        console.log("tr :"+tr)
        console.log("tr :"+tr.cells[i])
        tr.cells[0].innerHTML = i+1
    })
    updateProgramFromGraphData()
}

function rowEdit(){
    var tr = $(this).parents("tr")[0]
    var values=[]
    var position = tr.cells[0].innerHTML
    // console.log("isMAx cell :" +tr.cells[1].innerHTML.includes("feather-check-square"))
    values.push(tr.cells[1].innerHTML.includes("feather-check-square"))
    values.push(tr.cells[2].innerHTML)
    values.push(tr.cells[3].innerHTML)
    values.push(tr.cells[4].innerHTML)
    
    $("#graphDataTable > tbody > tr:nth-child("+(position)+")").remove()
    
    rowNew(position*1-1, values)   
    isDirty = true
    updateProgramFromGraphData()
}


function setProgramList(){
    var cb = function () {
        var data = JSON.parse(this.response)
        $('#programList').children().not(':first').remove()
        $("#programList")[0].selectedIndex = 0
        data.forEach((prog) => {
            $('#programList').append('<option value="'+prog.uuid+'">Program '+prog.name+'</option>');
        })
    }
    getAllProgramsfromDB(cb)
}

function updateProgramFromGraphData(){
    console.log(currentProgram)
    if(currentProgram == undefined || currentProgram == {}){
        currentProgram = {
            name : "temporaryName",
            segments : [],
            segmentsEditableStates : []
        }
    }
    console.log(currentProgram)
    currentProgram.segments = []
    currentProgram.segmentsEditableStates = []
    $("#graphDataTable > tbody >tr").each(function(i, seg) {
        var timeInMinutes = stringToTimeValue(seg.cells[3].innerText) 
        var newSegment = {
            targetTemperature: parseInt(seg.cells[2].innerHTML),
            duration: timeInMinutes,
            slope: parseInt(seg.cells[4].innerHTML),
            isFull: seg.cells[1].innerHTML.includes("feather-check-square")
        }
        console.log("new seg:"+newSegment)
       currentProgram.segments.push(newSegment)
       currentProgram.segmentsEditableStates.push(true)
    })
    console.log(currentProgram)
}

function updateGraphDataFromProgram(program){
    $("#graphDataTable > tbody").empty();
    if(program != undefined && program.segments != undefined){
        program.segments.forEach((seg) =>{
        var isMaxTr = '<td><span data-feather="square"></span></td>'
        if(seg.isFull){
            isMaxTr = '<td><span data-feather="check-square"></span></td>'
        }
        $('#graphDataTable tbody').append('<tr>'+
         '<td>'+($("#graphDataTable > tbody > tr").length*1+1)+'</td>'+
         isMaxTr+
         '<td>'+seg.targetTemperature+'</td>'+
         '<td>'+timeValueToString(seg.duration)+'</td>'+
         '<td>'+seg.slope+'</td>'+
         '<td>'+
         '    <a class="add" title="Add" style="display: none"><span data-feather="plus"></span></a>'+
         '    <a class="edit" title="Edit"><span data-feather="edit"></span></a>'+
         '    <a class="delete" title="Delete"><span data-feather="trash"></span></a>'+
         '</td>'+
       '</tr>');
       $('#graphDataTable tbody').eq($('#graphDataTable tbody').length-1)
       feather.replace()
        }) 
    }
}

function registerProgramListUpdate(){
    $('#programList').change(function(){
        var toget =$('#programList').val()
        var cb = function(program){
            currentProgram = program
            isDirty = false

            $("#deleteProgramButton").show()
            $("#saveButton").show()
            $("#saveAsButton").show()
            $("#startCookingButton").show()
            $("#delayedCookingButton").show()

            updateGraphDataFromProgram(program)
            displayGraph(currentProgram);
        }
        getOneProgramsfromDB(toget,cb)
    })
}

function registerDeleteButton(){
    $("#deleteProgramButton").click(function (){ //not saved in DB yet

        deleteProgramInDB(currentProgram.uuid) 
        currentProgram = {}
        updateGraphDataFromProgram()
        $("#programList")[0].selectedIndex = 0
    })
}

function registerSaveButtons(){
    $("#saveButton").click(function (){
        if(currentProgram.uuid == undefined || currentProgram.uuid == ""){
            var pName = prompt("Please enter the program name", "");
            console.log(" -> "+pName)
            if (pName == null || pName == ""){ //cancel or empty name
                return
            }
            currentProgram.name = pName
            var today = new Date()
            currentProgram.lastModificationDate = today.toJSON()
            saveProgramInDB(currentProgram)
        }else{
            var today = new Date()
            currentProgram.lastModificationDate = today.toJSON()
            saveProgramInDB(currentProgram, currentProgram.uuid)
        }
        setProgramList()
    })
    $("#saveAsButton").click(function (){
        var pName = prompt("Please enter the program name", "");
        console.log(" -> "+pName)
        if (pName == null || pName == ""){ //cancel or empty name
            return
        }
        currentProgram.name = pName
        currentProgram.uuid = uuidv4()
        var today = new Date()
        currentProgram.lastModificationDate = today.toJSON()
        saveProgramInDB(currentProgram)
        //take time how to synchronize ?
        setTimeout( function(){
            $('#programList option[value='+currentProgram.uuid+']').prop('selected', true);
            updateGraphDataFromProgram(currentProgram) //not useful but...
        }, 2000)
    })
}

function registerButtons(){
    registerDeleteButton()
    registerSaveButtons()
    registerShowHomeButton()
    registerShowProgramsButton()
    registerShowCurrentCookingButton()
    registerProgramListUpdate()
    registerAddEditDeleteButton()
}

function registerAddEditDeleteButton(){
    // Append table with add row form on add new button click
    var addB = document.getElementById("addNewRowButton");
    addB.onclick = rowNew;
	// Add row on add button click
	$(document).on("click", ".add", rowAdd);
	// // Edit row on edit button click
    $(document).on("click", ".edit", rowEdit);
    $(document).on("click", ".delete", rowDelete);
}

function registerShowHomeButton(){
    var b = document.getElementById("homeButton");
    b.onclick = function(){
        $("#home").show()
        $("#programs").hide()
        $("#programList").hide()
        $("#deleteProgramButton").hide()
        $("#saveButton").hide()
        $("#saveAsButton").hide()
        $("#startCookingButton").hide()
        $("#delayedCookingButton").hide()
        $("#stopCookingButton").hide()        
        $("#graphData").hide()
    }
    return;
}


function registerShowProgramsButton(){
    var b = document.getElementById("programsButton");
    b.onclick = function(){
        $("#home").hide()
        $("#programs").show()
        $("#programList").show()
        $("#saveButton").hide()
        $("#saveAsButton").hide()
        $("#deleteProgramButton").hide()
        $("#startCookingButton").hide()
        $("#delayedCookingButton").hide()
        $("#stopCookingButton").hide()    
        $("#graphData").show()
    }
    return;
}

function registerShowCurrentCookingButton(){
    var b = document.getElementById("currentCookingButton");
    b.onclick = function(){
        $("#home").hide()
        $("#programs").show()
        $("#startCookingButton").hide()
        $("#delayedCookingButton").hide()
        $("#stopCookingButton").show()    
        $("#programList").hide()
        $("#saveButton").hide()
        $("#saveAsButton").hide()
        $("#deleteProgramButton").hide()
        $("#graphData").hide()

    }
    return;
}

function getAllProgramsfromDB(callback){
    
    var request = new XMLHttpRequest()
    request.open('GET', 'http://127.0.0.1:3000/programs', true)
    request.setRequestHeader("Content-type", "application/json");
    request.onload = callback;
    request.send()
}

function getOneProgramsfromDB(progUuid, callback){
    
    var request = new XMLHttpRequest()
    request.open('GET', 'http://127.0.0.1:3000/programs', true)
    request.setRequestHeader("Content-type", "application/json");
    request.onload = function(){
        var data = JSON.parse(this.response)
        data.forEach((prog) => {
            if(prog.uuid == progUuid){
                callback(prog)
            }
        })
    };
    request.send()
}

function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

function deleteProgramInDB(progUuid){
    var reqType = 'DELETE'
    var url = 'http://127.0.0.1:3000/programs/'+progUuid
    var request = new XMLHttpRequest()
    request.open(reqType, url, true)
    request.setRequestHeader("Content-type", "application/json");
    request.onload = function () {
        // Begin accessing JSON data here
        console.log(this.response)
        // var data = JSON.parse(this.response)

        if (request.status >= 200 && request.status < 400) {
            console.log("program deleted")
            setProgramList()
        } else {
            console.log('error')
        }
    }
    request.send()
}

function saveProgramInDB(program, uuid){
    var reqType = 'PUT'
    var url = 'http://127.0.0.1:3000/programs/'+uuid
    if(uuid == undefined){ //new program
        reqType = 'POST'
        program.uuid=uuidv4()
        url = 'http://127.0.0.1:3000/programs'
    }

    var request = new XMLHttpRequest()
    request.open(reqType, url, true)
    request.setRequestHeader("Content-type", "application/json");
    request.onload = function () {
        // Begin accessing JSON data here
        console.log(this.response)
        var data = JSON.parse(this.response)

        if (request.status >= 200 && request.status < 400) {
            console.log("program saved")
            currentProgram = data
            setProgramList()
        } else {
            console.log('error')
        }
    }
    request.send(JSON.stringify(program))
    
}


$(document).ready(function()
{

    kilnState = KilnStates.READY
    $("#stopCookingButton").hide()
    $("#startCookingButton").hide()
    $("#delayedCookingButton").hide()
    $("#saveButton").hide()
    $("#saveAsButton").hide()
    $("#deleteProgramButton").hide()


    registerButtons();
    setProgramList();
    displayGraph(currentProgram);
    document.getElementById("actualKilnTemp").innerHTML = actualKilnTemp


    // if(!("WebSocket" in window))
    // {
    //     $('#chatLog, input, button, #examples').fadeOut("fast");
    //     $('<p>Oh no, you need a browser that supports WebSockets. How about <a href="http://www.google.com/chrome">Google Chrome</a>?</p>').appendTo('#container');
    // }
    // else
    // {

    //     // if(state!="RUNNING"){
    //     //     $("#currentCookingMenu").hide()
    //     // }

    //     // Status Socket ////////////////////////////////

    //     ws_status.onopen = function()
    //     { 
    //         console.log("Status Socket has been opened");
    //     };

    //     ws_status.onerror = function()
    //     {
    //         console.log(ws_status)
    //         alert("Kiln Regulator disconnected");
    //     };

    //     ws_status.onmessage = function(e)
    //     {
    //         console.log("received status data")
    //         console.log(e.data);

    //         x = JSON.parse(e.data);
    //         if (x.type == "backlog")
    //         {
    //             if (x.profile)
    //             {
    //                 selected_profile_name = x.profile.name;
    //                 $.each(profiles,  function(i,v) {
    //                     if(v.name == x.profile.name) {
    //                         updateProfile(i);
    //                         $('#e2').select2('val', i);
    //                     }
    //                 });
    //             }

    //             $.each(x.log, function(i,v) {
    //                 graph.live.data.push([v.runtime, v.temperature]);
    //                 graph.plot = $.plot("#graph_container", [ graph.profile, graph.live ] , getOptions());
    //             });
    //         }

    //         if(state!="EDIT")
    //         {
    //             state = x.state;

    //             if (state!=state_last)
    //             {
    //                 if(state_last == "RUNNING")
    //                 {
    //                     $('#target_temp').html('---');
    //                     updateProgress(0);
    //                     $.bootstrapGrowl("<span class=\"glyphicon glyphicon-exclamation-sign\"></span> <b>Run completed</b>", {
    //                     ele: 'body', // which element to append to
    //                     type: 'success', // (null, 'info', 'error', 'success')
    //                     offset: {from: 'top', amount: 250}, // 'top', or 'bottom'
    //                     align: 'center', // ('left', 'right', or 'center')
    //                     width: 385, // (integer, or 'auto')
    //                     delay: 0,
    //                     allow_dismiss: true,
    //                     stackup_spacing: 10 // spacing between consecutively stacked growls.
    //                     });
    //                 }
    //             }

    //             if(state=="RUNNING")
    //             {
    //                 $("#currentCookingMenu").hide()
    //                 $("#startCookingButton").hide();
    //                 $("#stopCookingButton").show();

    //                 graph.live.data.push([x.runtime, x.temperature]);
    //                 graph.plot = $.plot("#graph_container", [ graph.profile, graph.live ] , getOptions());

    //                 left = parseInt(x.totaltime-x.runtime);
    //                 eta = new Date(left * 1000).toISOString().substr(11, 8);

    //                 updateProgress(parseFloat(x.runtime)/parseFloat(x.totaltime)*100);
    //                 $('#state').html('<span class="glyphicon glyphicon-time" style="font-size: 22px; font-weight: normal"></span><span style="font-family: Digi; font-size: 40px;">' + eta + '</span>');
    //                 $('#target_temp').html(parseInt(x.target));


    //             }
    //             else
    //             {
    //                 $("#nav_start").show();
    //                 $("#nav_stop").hide();
    //                 $('#state').html('<p class="ds-text">'+state+'</p>');
    //             }

    //             $('#act_temp').html(parseInt(x.temperature));
                
    //             if (x.heat > 0.5) { $('#heat').addClass("ds-led-heat-active"); } else { $('#heat').removeClass("ds-led-heat-active"); }
    //             if (x.cool > 0.5) { $('#cool').addClass("ds-led-cool-active"); } else { $('#cool').removeClass("ds-led-cool-active"); }
    //             if (x.air > 0.5) { $('#air').addClass("ds-led-air-active"); } else { $('#air').removeClass("ds-led-air-active"); }
    //             if (x.temperature > hazardTemp()) { $('#hazard').addClass("ds-led-hazard-active"); } else { $('#hazard').removeClass("ds-led-hazard-active"); }
    //             if ((x.door == "OPEN") || (x.door == "UNKNOWN")) { $('#door').addClass("ds-led-door-open"); } else { $('#door').removeClass("ds-led-door-open"); }

    //             state_last = state;

    //         }
    //     };

    //     // Config Socket /////////////////////////////////
        
    //     ws_config.onopen = function()
    //     {
    //         ws_config.send('GET');
    //     };

    //     ws_config.onmessage = function(e)
    //     {
    //         console.log (e.data);
    //         x = JSON.parse(e.data);
    //         temp_scale = x.temp_scale;
    //         time_scale_slope = x.time_scale_slope;
    //         time_scale_profile = x.time_scale_profile;
    //         kwh_rate = x.kwh_rate;
    //         currency_type = x.currency_type;
            
    //         if (temp_scale == "c") {temp_scale_display = "C";} else {temp_scale_display = "F";}
              

    //         $('#act_temp_scale').html('º'+temp_scale_display);
    //         $('#target_temp_scale').html('º'+temp_scale_display);

    //         switch(time_scale_profile){
    //             case "s":
    //                 time_scale_long = "Seconds";
    //                 break;
    //             case "m":
    //                 time_scale_long = "Minutes";
    //                 break;
    //             case "h":
    //                 time_scale_long = "Hours";
    //                 break;
    //         }
            
    //     }

    //     // Control Socket ////////////////////////////////

    //     ws_control.onopen = function()
    //     {

    //     };

    //     ws_control.onmessage = function(e)
    //     {
    //         //Data from Simulation
    //         console.log ("control socket has been opened")
    //         console.log (e.data);
    //         x = JSON.parse(e.data);
    //         graph.live.data.push([x.runtime, x.temperature]);
    //         graph.plot = $.plot("#graph_container", [ graph.profile, graph.live ] , getOptions());

    //     }

    //     // Storage Socket ///////////////////////////////

    //     ws_storage.onopen = function()
    //     {
    //         ws_storage.send('GET');
    //     };


    //     ws_storage.onmessage = function(e)
    //     {
    //         message = JSON.parse(e.data);

    //         if(message.resp)
    //         {
    //             if(message.resp == "FAIL")
    //             {
    //                 if (confirm('Overwrite?'))
    //                 {
    //                     message.force=true;
    //                     console.log("Sending: " + JSON.stringify(message));
    //                     ws_storage.send(JSON.stringify(message));
    //                 }
    //                 else
    //                 {
    //                     //do nothing
    //                 }
    //             }

    //             return;
    //         }

    //         //the message is an array of profiles
    //         //FIXME: this should be better, maybe a {"profiles": ...} container?
    //         profiles = message;
    //         //delete old options in select
    //         $('#e2').find('option').remove().end();
    //         // check if current selected value is a valid profile name
    //         // if not, update with first available profile name
    //         var valid_profile_names = profiles.map(function(a) {return a.name;});
    //         if (
    //           valid_profile_names.length > 0 && 
    //           $.inArray(selected_profile_name, valid_profile_names) === -1
    //         ) {
    //           selected_profile = 0;
    //           selected_profile_name = valid_profile_names[0];
    //         }            

    //         // fill select with new options from websocket
    //         for (var i=0; i<profiles.length; i++)
    //         {
    //             var profile = profiles[i];
    //             //console.log(profile.name);
    //             $('#e2').append('<option value="'+i+'">'+profile.name+'</option>');

    //             if (profile.name == selected_profile_name)
    //             {
    //                 selected_profile = i;
    //                 $('#e2').select2('val', i);
    //                 updateProfile(i);
    //             }
    //         }
    //     };


        // $("#e2").select2(
        // {
        //     placeholder: "Select Profile",
        //     allowClear: true,
        //     minimumResultsForSearch: -1
        // });


        // $("#e2").on("change", function(e)
        // {
        //     updateProfile(e.val);
        // });

    });
