let apiUrl = 'http://localhost:3000/api/';

let Chart = require('chart.js');
let barBorderColor = '#F1ECEB';
let barBackgroundColor = "rgba(241, 236, 235, 0.8)";
let chartOptions = {
    scales: {
        yAxes: [{
            ticks: {
                fontColor: 'white'
            },
            gridLines: {
                color: "#20343d"
            },
        }],
        xAxes: [{
            ticks: {
                fontColor: 'white'
            },
            gridLines: {
                color: "#20343d"
            },
        }]
    },
    legend: {
        labels: {
            fontColor: 'white'
        }
    },
};
let dailyStatsDate = '2020-04-19';

window.addEventListener('DOMContentLoaded', (event) => {
    getDailyStats(dailyStatsDate);
    let dateSelect = document.getElementById('dateSelect');
    dateSelect.oninput = function(e) {
        dailyStatsDate = e.target.value.toString();
        getDailyStats(dailyStatsDate);
    };
});

window.addEventListener('resize', (event) => {
    getDailyStats(dailyStatsDate);
});


function getDailyStats(date){
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let response = JSON.parse(this.responseText);
            visitorsPerRoomStats(date, response.visitors_per_hour);
            visitorsPerRoomPerHourStats(date, response.visitors_per_room_per_hour);
            POIattractionPower(date, response.POI);
            POIholdingPower(date, response.POI);
        }else{
            visitorsPerRoomStats(date);
            visitorsPerRoomPerHourStats(date);
        }
    };
    xmlhttp.open("GET", apiUrl + "daily_stats/" + date, true);
    xmlhttp.send();
}

function visitorsPerRoomStats(date, visitorsPerHour){
    let canvas =  document.getElementById('visitorsPerHour');
    resizeCanvas(canvas);
    let ctx =  canvas.getContext('2d');
    let chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00',
                '08:00', '09:00', '10:00', '12:00', '13:00', '14:00', '15:00', '16:00',
                '17:00', '18:00', '19:00', '20:00', '21:00', '22:00','23:00'],
            datasets: [{
                label: date,
                data: visitorsPerHour,
             /*   backgroundColor: [
                    curveColor,
                    curveColor,
                    curveColor,
                    curveColor,
                    curveColor,
                    curveColor,
                    curveColor,
                    curveColor,
                    curveColor,
                    curveColor,
                    curveColor,
                    curveColor,
                    curveColor,
                    curveColor,
                    curveColor,
                    curveColor,
                    curveColor,
                    curveColor,
                    curveColor,
                    curveColor,
                    curveColor,
                    curveColor,
                    curveColor,
                    curveColor
                ],*/
                borderColor: barBorderColor,
                borderWidth: 2,
                spanGaps: false
            }]
        },
        options: combineOptions({title: {
                display: true,
                fontColor: 'white',
                text: 'Visitors per hour in general during the day'
            }}, chartOptions)
    });

}

function visitorsPerRoomPerHourStats(date, visitorsPerRoomPerHour){
    let canvas =  document.getElementById('visitorsPerRoomPerHour');
    resizeCanvas(canvas);
    let ctx =  canvas.getContext('2d');

    let datasets = [];
    let i = 1;
    for (let key in visitorsPerRoomPerHour){
        datasets.push({
            label: 'Room ' + i,
            spanGaps: false,
            data: visitorsPerRoomPerHour[key].map((value) => {if(value === 0){value = NaN} return value}),
            borderColor: getRandomColor(),
            borderWidth: 2
        });
        i++;
    }

    let chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00',
                '08:00', '09:00', '10:00', '12:00', '13:00', '14:00', '15:00', '16:00',
                '17:00', '18:00', '19:00', '20:00', '21:00', '22:00','23:00'],
            datasets: datasets
        },
        options: combineOptions({title: {
                display: true,
                fontColor: 'white',
                text: 'Visitors per room per hour during the day ' + date
            }}, chartOptions)
    });

}

function POIattractionPower(date, POI){
    let canvas =  document.getElementById('POIattractionPower');
    resizeCanvas(canvas);

    let ctx =  canvas.getContext('2d');
    let data = [];
    let labels = [];
    let i = 1;
    for (let key in POI){
        data.push(POI[key].total_attraction_power);
        labels.push(key.toString());
        i++;
    }

    let options =  combineOptions({title: {
            display: true,
            fontColor: 'white',
            text: 'Attraction Power per POI during the day ' + date
        }}, chartOptions);

    options.scales.yAxes[0].ticks["max"] = 1.0;
    options.legend["display"] = false;

    let chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                spanGaps: false,
                data: data,
                borderColor: barBorderColor,
                backgroundColor: barBackgroundColor,
                borderWidth: 2
            }]
        },
        options: options
    });

}

function POIholdingPower(date, POI){
    let canvas =  document.getElementById('POIholdingPower');
    resizeCanvas(canvas);

    let ctx =  canvas.getContext('2d');
    let data = [];
    let labels = [];
    let i = 1;
    for (let key in POI){
        data.push(POI[key].total_holding_power);
        labels.push(key.toString());
        i++;
    }

    let options = combineOptions({title: {
            display: true,
            fontColor: 'white',
            text: 'Holding Power per POI during the day ' + date
        }}, chartOptions);

    delete options.legend.labels['fontColor'];
    options.legend["display"] = false;
    //options.scales.yAxes[0].ticks["max"] = 1.0;

    let chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                spanGaps: false,
                data: data,
                borderColor: barBorderColor,
                backgroundColor: barBackgroundColor,
                borderWidth: 2
            }]
        },
        options: options
    });

}

function resizeCanvas(canvas){
    let parent = canvas.parentNode,
        styles = getComputedStyle(parent),
        w = parseInt(styles.getPropertyValue("width"), 10),
        h = parseInt(styles.getPropertyValue("height"), 10);

    canvas.width = w;
    canvas.height = h;

}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function combineOptions(newOptions, oldOptions){
    return Object.assign(newOptions, JSON.parse(JSON.stringify(oldOptions)));
}