const fs = require('fs');
let Papa = require('papaparse');
let utils = require('../utils');
let dbAPI = require('./database_API');
let path = './resources/visitors_log/';
let totalStats = require('./total_stats');
let dailyStats = require('./daily_stats');
let floorStructure = require('./floor_structure');
let collection = "visitors";


/*
Structure of visitor documents in the mongodb database:
[
    {
        visitor_ID: '1',
        group_ID: '4',
        position_log: [{start: ..., end: ..., location: ...}, ...],
        presentations_log: [{start: ..., end: ..., about: ..., ended_by: ...}, ...],
        day_of_visit: '2020-04-16'
    },
    {
        ....
    },
]*/

module.exports = {
    insertVisitor: function () {
        fs.readdir('./resources/visitors_log',  async(err, filenames) => {
            let newData = await parseMultipleLogs(filenames);
            await dbAPI.insertDocument(newData.visitorLogs, 'visitors');
            await updateStats(newData);
        });
    },

    getVisitor: function(query) {
        return new Promise(async function (resolve, reject) {
            await dbAPI.getDocument(query, collection).then((visitor) => {
                resolve(visitor);
            });
        });
    },

    updateVisitor: function (query, newValue){
        let newValues = { $set: newValue};
        dbAPI.updateDocument(query, newValues, collection);
    }

}

async function parseMultipleLogs(filenames){
    let logs = [];
    for (const filename of filenames) {
        await parseVisitorLog(path + filename, logs);
    }
    return adjustVisitorData(logs);
}

async function parseVisitorLog(filename, logs){
    await readFilePromise(filename, 'utf-8')
        .then(file => {
            papaParsePromise(file, filename)
                .then(file => {
                    logs.push([filename].concat(file));
            })
        })
        .catch(err => { console.log(err) });
}

const readFilePromise = (path, options) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, options, (err, file) => {
            if (err) return reject(err)
            resolve(file)
        })
    })
};

const papaParsePromise = (file, filename) => {
    return new Promise((resolve, reject) =>{
        Papa.parse(file , {
            skipEmptyLines : true,
            complete: function (results) {
                if (results.errors === undefined || (results.errors).length === 0) {
                    return resolve(results.data);
                }else {
                    //console.log(filename + " couldn't be parsed, please check if there's something wrong with it.");
                }},
        });

    })
};

/*The visitor log data needs to be adjusted to fit properly in the db.
  Right now the log is divided in Positions and Presentations, we need to obtain something that resembles the top
  comment in this file.
*/
function adjustVisitorData(logs){
    let newData = {
        visitorLogs : [],
        visitorsPerHour : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //24 hours
        visitorsPerRoomPerHour : {
            1: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            2: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            3: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            4: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            5: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            6: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            7: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        },
        visitorsPerPOI : new Map(), //key: POI value: how many visitors saw that POI that day
        cumulativeTimePerPOI : new Map(), //key: POI value: cumulative time spent by every visitor on that POI
        totalPOITime : 0, //sum of the time spent on all POIs together
        cumulativeVisitorTimeInMuseum : 0, //Sum of the time spent in the museum by every visitor
        sumOfWatchedPresentations : 0 //Sum of the number of presentations watched by every visitor
    };

    for (const log of logs) {
        let temp = log[0].match( /\d+/g ); //filename has visitor and group ID
        let visitorID = temp[0];
        let groupID = temp[1];
        let visitLog = [];
        let presentationsLog = [];
        let dayOfVisit = new Date(utils.getToday()); //we don't have this info in the given data, this is an assumption

        let parsingPositions = false;
        let parsingPresentations = false;
        let parsingEvents = false;
        let firstTimeEntry = false; //while parsing have we found the first time entry (ex '11:23:14') ?
        let visitStart = '00:00:00';
        let visitEnd = '00:00:00';
        let alreadyVisitedPosition = [];
        for (const entry of log) {

            if (entry[0] === 'Positions ') {
                parsingPositions = true;
            } else if (entry[0] === 'presentations ') {
                parsingPositions = false;
                parsingPresentations = true;
            } else if (entry[0] === 'events ') {
                parsingPositions = false;
                parsingPresentations = false;
                parsingEvents = true;
            }

            if (parsingPositions && entry[0] !== 'Positions ')
            {
                let start = entry[0];
                let end = entry[1];
                let position = entry[2];
                if(!firstTimeEntry) {
                    firstTimeEntry = true;
                    visitStart = start;
                    visitEnd = end;
                }
                if(utils.isFirstTimestampGreaterThanSecond(end,visitEnd)){
                    visitEnd = end;
                }
                adjustPositionData(start,end,position,visitLog,newData,alreadyVisitedPosition);

            } else if (parsingPresentations && entry[0] !== 'presentations ')
            {
                newData.sumOfWatchedPresentations++;
                if(utils.isFirstTimestampGreaterThanSecond(entry[1],visitEnd)){
                    visitEnd = entry[1];
                }
                presentationsLog.push({start: entry[0], end: entry[1], about: entry[2], ended_by: entry[3]});
            } else if (parsingEvents && entry[0] !== 'events  '){
                if(utils.isFirstTimestampGreaterThanSecond(entry[1],visitEnd)){
                    visitEnd = entry[1];
                }
            }
        }

        newData.cumulativeVisitorTimeInMuseum += utils.getTimeSpent(visitStart,visitEnd);
        newData.visitorLogs.push({
            visitor_ID : visitorID,
            group_ID : groupID,
            day_of_visit : dayOfVisit,
            position_log : visitLog,
            presentations_log : presentationsLog
        });
    }

    return newData;
}

function adjustPositionData(start,end,position,visitLog,newData,alreadyVisitedPosition){
    visitLog.push({start: start, end:end, location: end}); //start, end, position
    let positionStart = parseInt(start.substring(0, 2));
    let positionEnd = parseInt(start.substring(0, 2));
    for (let i = positionStart; i <= positionEnd; i++) {
        newData.visitorsPerHour[i]++;
        newData.visitorsPerRoomPerHour[floorStructure.getRoom(position)][i]++;
    }

    if(!alreadyVisitedPosition.includes(position)) { //avoid putting the same visitor twice if they come back
        alreadyVisitedPosition.push(position);
        if (newData.visitorsPerPOI.has(position)) {
            newData.visitorsPerPOI.set(position, newData.visitorsPerPOI.get(position) + 1);
        } else {
            newData.visitorsPerPOI.set(position, 1);
        }
    }

    let timeSpent = utils.getTimeSpent(start,end);

    if(newData.cumulativeTimePerPOI.has(position)){
        newData.cumulativeTimePerPOI.set(position, newData.cumulativeTimePerPOI.get(position)+timeSpent);
    }else{
        newData.cumulativeTimePerPOI.set(position, timeSpent);
    }
    newData.totalPOITime += timeSpent;
}



async function updateStats(newData){
    //update total stats
    await totalStats.getTotalStats().then((stats) => {
        let newStats = setNewStats(stats,newData);
        totalStats.updateTotalStats(newStats);
    });
    //update daily stats
    let day = new Date('2020-04-19');
    await dailyStats.getDailyStats(day).then((stats) => {
        let newStats = setNewStats(stats,newData);
        newStats.visitors_per_hour = newData.visitorsPerHour;
        newStats.visitors_per_room_per_hour = newData.visitorsPerRoomPerHour;
        dailyStats.updateDailyStats(newStats,day);
    });
}

function setNewStats(stats,newData){
    let newNumberOfVisitors = newData.visitorLogs.length + stats.number_of_visitors;
    let totalVisitorTimeInMuseum = stats.average_visitor_time_in_museum * stats.number_of_visitors;
    let newVisitorTime = newData.cumulativeVisitorTimeInMuseum + totalVisitorTimeInMuseum;
    let newAverageVisitorTime = (newData.cumulativeVisitorTimeInMuseum + ( totalVisitorTimeInMuseum ))
        /( newNumberOfVisitors );
    let newAverageWatchedPresentations = (newData.sumOfWatchedPresentations + ( stats.average_watched_presentations * stats.number_of_visitors  ))
        /( newNumberOfVisitors );
    for (let [key, value] of Object.entries(stats.POI)) {
        if(newData.visitorsPerPOI.has(key)){
            value.total_attraction_power = (newData.visitorsPerPOI.get(key) + value.total_attraction_power * stats.number_of_visitors) / newNumberOfVisitors;
        }

        if(newData.cumulativeTimePerPOI.has(key)){
            value.total_holding_power = (newData.cumulativeTimePerPOI.get(key) + value.total_holding_power * totalVisitorTimeInMuseum) / newVisitorTime;
        }
    }

    return {
        POI: stats.POI,
        number_of_visitors : newNumberOfVisitors,
        average_visitor_time_in_museum : newAverageVisitorTime,
        average_watched_presentations: newAverageWatchedPresentations
    }
}