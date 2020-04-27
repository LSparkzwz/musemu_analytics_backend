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
let defaultVisitorID = '201';
let groupData = [];
let currentGroupID;

window.addEventListener('DOMContentLoaded', (event) => {
    getDailyStats(dailyStatsDate);
    getTotalStats();
    getVisitorStats(defaultVisitorID);

    let museumDataButton = document.getElementById('museumDataButton');
    let visitorDataButton = document.getElementById('visitorDataButton');
    let statsDisplay = document.getElementById('stats');
    let visitorDisplay = document.getElementById('visitorData');
    changeDisplayedData
    (museumDataButton,visitorDataButton, statsDisplay, visitorDisplay, 'visible','hidden');

    museumDataButton.addEventListener("click", () =>
        changeDisplayedData
        (museumDataButton,visitorDataButton,statsDisplay,visitorDisplay, 'visible', 'hidden')
    );
    visitorDataButton.addEventListener("click", () =>
        changeDisplayedData
        (visitorDataButton,museumDataButton,visitorDisplay,statsDisplay, 'hidden', "visible")
    );

    let getVisitorButton = document.getElementById('getVisitorButton');
    let getGroupButton = document.getElementById('getGroupButton');
    let idSelect = document.getElementById('idSelect');

    getVisitorButton.addEventListener("click", () => {
        if(idSelect.value){
            getVisitorStats(idSelect.value);
        }
    });

    getGroupButton.addEventListener("click", () => {
        if(idSelect.value){
            getGroupStats(idSelect.value, true);
        }
    });




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

function getTotalStats(){
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let response = JSON.parse(this.responseText);
            let otherInfo = document.getElementById('oInfo');

            let avgGroupSize = document.createElement("li");
            avgGroupSize.innerHTML = "Average group size: ";
            avgGroupSize.style.color = "#F1ECEB";
            avgGroupSize.classList.add("statInfo");

            let li = document.createElement("li");
            li.innerHTML =  (response.average_group_size).toFixed(2);
            avgGroupSize.appendChild(li);
            addSeparator(avgGroupSize);

            let avgVisitorTime = document.createElement("li");
            avgVisitorTime.innerHTML = "Average visitor time in museum: ";
            avgVisitorTime.style.color = "#F1ECEB";
            avgVisitorTime.classList.add("statInfo");

            li = document.createElement("li");
            li.innerHTML =  (response.average_visitor_time_in_museum / 3600).toFixed(2) + " hours";
            avgVisitorTime.appendChild(li);
            addSeparator(avgVisitorTime);

            let avgPresentations = document.createElement("li");
            avgPresentations.innerHTML = "Average presentations watched: ";
            avgPresentations.style.color = "#F1ECEB";
            avgPresentations.classList.add("statInfo");

            li = document.createElement("li");
            li.innerHTML =  (response.average_watched_presentations).toFixed(2);
            avgPresentations.appendChild(li);
            addSeparator(avgPresentations);


            otherInfo.appendChild(avgVisitorTime);
            otherInfo.appendChild(avgGroupSize);
            otherInfo.appendChild(avgPresentations);
        }
    };
    xmlhttp.open("GET", apiUrl + "total_stats/", true);
    xmlhttp.send();
}

function getVisitorStats(id){
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let response = JSON.parse(this.responseText);
            console.log(response[0])

            if(currentGroupID !== response[0].group_ID) {
                getGroupStats(response[0].group_ID);
            }

            let visitSummary = createVisitSummary(response[0]['position_log']);
            let visSummary = document.getElementById('visitSummary');
            visSummary.innerHTML =''; //clean

            for(let entry in visitSummary){
                let li = document.createElement("li");
                li.innerHTML = entry + " : " + visitSummary[entry];
                li.classList.add("whiteFont");
                li.classList.add("statInfo");
                visSummary.appendChild(li);
                addSeparator(visSummary);
            }

            let presentationSummary = createPresentationSummary(response[0]['presentations_log']);
            let presentationTitle = document.getElementById('presentationTitle');
            presentationTitle.innerHTML = "Presentations watched:  " + Object.keys(presentationSummary).length;

            let presSummary = document.getElementById('presentationSummary');
            presSummary.innerHTML = '';  //clean

            for(let entry in presentationSummary){
                let li = document.createElement("li");
                li.innerHTML = entry + ": " + presentationSummary[entry].about + ", ended by: ";
                li.classList.add("whiteFont");
                li.classList.add("statInfo");
                let div = document.createElement("div");
                let endedBy = document.createElement("li");
                endedBy.innerHTML = presentationSummary[entry].ended_by;
                if(presentationSummary[entry].ended_by === "System"){
                    endedBy.style.color = "#39a355";
                }
                else{
                    endedBy.style.color = "#801c1c";
                }

                div.appendChild(li);
                li.appendChild(endedBy);
                presSummary.appendChild(div);
                addSeparator(presSummary);

            }
        }
    };
    xmlhttp.open("GET", apiUrl + "visitors/id/" +id, true);
    xmlhttp.send();
}

function getGroupStats(id, newGroup){
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            groupData = JSON.parse(this.responseText);
            if(newGroup) getVisitorStats(groupData[0].visitor_ID); //query on group needs to replace current visitor

            currentGroupID = id;
            let groupTitle = document.getElementById('groupTitle');
            groupTitle.innerHTML = "Group ID: " + id;
            let groupMembers = document.getElementById('groupMembers');
            groupMembers.innerHTML = "";

            for(const visitor of groupData){
                let li = document.createElement("li");
                li.innerHTML = visitor.visitor_ID;
                li.classList.add("whiteFont");
                li.classList.add("textAlignCenter");
                li.classList.add("clickable");
                li.addEventListener("click", () =>{
                    getVisitorStats(visitor.visitor_ID);
                });
                groupMembers.appendChild(li);
                addSeparator(groupMembers);
            }
        }
    };
    xmlhttp.open("GET", apiUrl + "visitors/group/" +id, true);
    xmlhttp.send();
}

function createVisitSummary(visitLog){
    let visitSummary = {};
    for(const log of visitLog){
        let start = new Date('2020-10-10T'+log.start); //cheap trick for easy time diff calcs
        let end = new Date('2020-10-10T'+log.end);
        if(!(log.location in visitSummary)){
            visitSummary[log.location] = (end.getTime() - start.getTime()) / 60000;
        }else{
            visitSummary[log.location] += ((end.getTime() - start.getTime())  / 60000);
        }
    }
    for (let location in visitSummary) {
        let time = Math.round(visitSummary[location]);
        if (time === 0){
            time = "Less than 1min";
        }else if (time === 1 ){
            time = time + "min";
        }else{
            time = time + "min";
        }
        visitSummary[location] = time;
    }
    return visitSummary;
}

function createPresentationSummary(presentationLog){
    let presentationSummary = {};
    for(const entry of presentationLog){
        if(presentationSummary[entry.id] === undefined || entry.ended_by === "User"){
            presentationSummary[entry.id] ={about: entry.about, ended_by: entry.ended_by};
        }
    }
    return presentationSummary;
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

function changeDisplayedData(clickedButton, otherButton, toDisplay, toHide, dateVisibility, idGetVisibility){
    clickedButton.style.background = '#39a355';
    otherButton.style.background = 'transparent';
    toDisplay.style.display = 'flex';
    toHide.style.display = 'none';
    let dateSelect = document.getElementById('dateSelect');
    dateSelect.style.visibility = dateVisibility;
    let idSelContainer = document.getElementById('idSelContainer');
    idSelContainer.style.visibility = idGetVisibility;


}

function addSeparator(element){
    let div = document.createElement("div");
    div.style.height = "0px";
    div.style.width = "100%";
    div.style.background ='#20343d';
    div.style.padding ='1px';
    element.appendChild(div);
}



