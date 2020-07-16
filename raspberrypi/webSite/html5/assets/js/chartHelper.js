var temperatureChart


const sumReducer = (accumulator, currentValue) => accumulator + currentValue.duration;

export function retrieveProgramData(temperatureChart, program){
    var value = []
    var time = []
    if(program.segments == undefined){
        return
    }
    for(var i = 0; i < program.segments.length; i++){
        value.push(parseInt(program.segments[i].targetTemperature))
        time.push(moment.now()+moment.duration({minutes: parseInt(program.segments.slice(0,i+1).reduce(sumReducer, 0))}))
        temperatureChart.data.datasets[0].data.push({x:time[i],y:value[i]});
    }
    temperatureChart.data.datasets[0].data.unshift({x:moment.now(),y:25});
    console.log(temperatureChart.data.datasets[0].data)

    temperatureChart.update()
}

export function addCurrentCookingLine(temperatureChart){
    temperatureChart.data.datasets.push(
        {
        label: "actualCook",
        data:[{
            y: 24,
            x: moment.now()+moment.duration({minutes: 0,hours: 0})
          }],
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: '#ff7bff',
        borderWidth: 4,
        pointBackgroundColor: '#ff7bff'
    });
   
    temperatureChart.update();
    }

export function addCookingValue(temperatureChart, point){
    temperatureChart.data.datasets[1].data.push(point);
    temperatureChart.update();
}

export function displayGraph(program){
    console.log("display graph ")
    var ctx = document.getElementById("temperatureChart");
    temperatureChart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: "program",
        data:[],
            lineTension: 0,
            backgroundColor: 'transparent',
            borderColor: '#007bff',
            borderWidth: 2,
            pointBackgroundColor: '#007bff'
         
        }],
    },
    options: {
        scales: {
        xAxes: [{
                    type: 'time',
                    distribution: 'linear',
                    time: {
                    displayFormats: {
                        quarter: 'hh:mm'
                    }
            }
            }],
        yAxes: [{
            ticks: {
            beginAtZero: true
            }
        }]
        },
        legend: {
        display: false,
        }
    }
   
 } );
    if(program != undefined && program != {}){
        retrieveProgramData(temperatureChart, program);
    }
    // addCurrentCookingLine(temperatureChart)
    // addCookingValue(temperatureChart, {
    //     y: 25,
    //     x: moment.now()+moment.duration({minutes: 1,hours: 0})
    //   });
    //   addCookingValue(temperatureChart, {
    //     y: 27,
    //     x: moment.now()+moment.duration({minutes: 2,hours: 0})
    //   });

    //   addCookingValue(temperatureChart, {
    //     y: 49,
    //     x: moment.now()+moment.duration({minutes: 4,hours: 0})
    //   });

    //   addCookingValue(temperatureChart, {
    //     y: 32,
    //     x: moment.now()+moment.duration({minutes: 6,hours: 0})
    //   });
}