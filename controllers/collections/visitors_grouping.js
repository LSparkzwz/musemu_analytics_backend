const fs = require('fs');
let dbAPI = require('./database_API');
let utils = require('../utils');
let fileParser = require('../file_parser');
let stats = require('./stats');
let collection = "visitors_grouping";
let date = new Date('2020-04-29');


module.exports = {
    insertGrouping: function (file, filename) {
        //let file = fs.createReadStream('resources/visitors_grouping.csv');
        fileParser.parse(file, filename, {
            header: true,
            transformHeader: function (h) {
                return h.trim();
            }})
            .then(async(results) => {
                let grouping = adjustGroupData(results);
                let query = "group_ID";
                await dbAPI.updateElseInsertDocument(query,  grouping, collection);
                await stats.updateGroupStats(grouping, date);
            })
            .catch(err => { console.log(err) });
        },

    getGroup: function(query){
        return new Promise(async function(resolve, reject) {
            await dbAPI.getDocument(query, collection).then((group) => {
                resolve(group);
            });
        });
    }
}

/*
 * After parsing now we have something like this:
 *   [
 *      { Visitors_ID: '1', Group_ID: '1' },
 *      { Visitors_ID: '2', Group_ID: '1' },
 *      ...
 *   ]
 * We want instead something like this:
 *   [
 *      { group_ID: '1', visitors_ID: ['1','2'], day: '2020-04-16' },   //this is a single mongoDB document that represents a group and its members
 *       ....
 *   ]
 */

function adjustGroupData(visitors_grouping){
    /*
     * We first obtain something like this:
     *  {
     *       '1': [ '1', '2'],
     *  }
     */
    let group_to_values = visitors_grouping.reduce(function (obj, item) {
        obj[item.Group_ID] = obj[item.Group_ID] || [];
        obj[item.Group_ID].push(item.Visitors_ID);
        return obj;
    }, {});

    //And we finally obtain the data structure we need for mongoDB
    return Object.keys(group_to_values).map(function (key) {
        return {group_ID: key, visitors_ID: group_to_values[key], day : new Date('2020-04-29')};
    });
}




