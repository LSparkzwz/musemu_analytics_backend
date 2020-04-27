const fs = require('fs');
let utils = require('../utils');
let dbAPI = require('./database_API');
let path = './resources/visitors_log/';
let floorStructure = require('./floor_structure');
let fileParser = require('../file_parser');
let stats = require('./stats');
let collection = "visitors";
let date = new Date('2020-04-19');
let Visitor = require('../../models/visitor');


module.exports = {
   /* initializeVisitors: function () {
        fs.readdir('./resources/visitors_log',  async(err, filenames) => {
            let newData = await initializeVisitors(filenames);
            await dbAPI.insertDocument(newData.visitors, collection);
            await stats.updateVisitorStats(newData);
        });
    },*/

    getVisitor: function(query) {
        return new Promise(async function (resolve, reject) {
            await dbAPI.getDocument(query, collection).then((visitor) => {
                resolve(visitor);
            });
        });
    },

    updateVisitors: async function (files){
         let newData = await getLogData(files);
         let queryValue = newData.visitors.map(visitor => visitor.visitor_ID);
         console.log(queryValue)
         let query = 'visitor_ID';
         await dbAPI.updateElseInsertDocument(query,  newData.visitors , collection);
         await stats.updateVisitorStats(newData, date);
    }
};

async function getLogData(files){
    let logs = [];
    for (const file of files) {
        await fileParser.parse(file, file.originalname, {skipEmptyLines : true})
            .then(result=> { logs.push([file.originalname].concat(result)); })
            .catch(err => { console.log(err) });
    }
    return elaborateLogData(logs);
}




/*
  The visitor log data needs to be adjusted to fit properly in the db.
  Right now the log is divided in Positions and Presentations, we need to obtain something that resembles the top
  comment in this file.

  Parsing the visitor logs will also update stat and grouping collection data as a side effect
*/
function elaborateLogData(logs){
    let newData = {
        visitors : [],
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
        let visitor = new Visitor;
        let filename = log[0].match( /\d+/g ); //filename has visitor and group ID
        visitor.visitor_ID = filename[0];
        visitor.group_ID = filename[1];
        visitor.position_log = [];
        visitor.day_of_visit = date; //we don't have this info in the given data, this is an assumption

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
                adjustPositionData(start,end,position,visitor.position_log,newData,alreadyVisitedPosition);

            } else if (parsingPresentations && entry[0] !== 'presentations ')
            {
                newData.sumOfWatchedPresentations++;
                if(utils.isFirstTimestampGreaterThanSecond(entry[1],visitEnd)){
                    visitEnd = entry[1];
                }
                visitor.presentations_log.push({start: entry[0], end: entry[1], about: entry[2], ended_by: entry[3]});

            } else if (parsingEvents && entry[0] !== 'events  '){
                if(utils.isFirstTimestampGreaterThanSecond(entry[1],visitEnd)){
                    visitEnd = entry[1];
                }
            }
        }

        newData.cumulativeVisitorTimeInMuseum += utils.getTimeSpent(visitStart,visitEnd);
        newData.visitors.push(visitor);
    }
    return newData;
}

function adjustPositionData(start, end, position, positionLog, newData, alreadyVisitedPosition){
    positionLog.push({start: start, end:end, location: position}); //start, end, position
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

/*
async function initializeVisitors(filenames){
    let logs = [];
    for (const filename of filenames) {
        await fileParser.readFile(path + filename, 'utf-8')
            .then(file => {
                fileParser.parse(file, filename, {skipEmptyLines : true})
                    .then(file => {
                        logs.push([filename].concat(file));
                    })
            })
            .catch(err => { console.log(err) });
    }
    return elaborateLogData(logs);
}*/
