const fs = require('fs');
let Papa = require('papaparse');
let dbAPI = require('./database_API');
let totalStats = require('./total_stats');
let dailyStats = require('./daily_stats');
let utils = require('../utils');
let collection = "visitors_grouping";


/*
 * visitors_grouping is an object with the following structure:
 *  { group_ID: ..., visitors_ID: [...], day: ... }
 */

module.exports = {
    insertGrouping: function () {
        let file = fs.createReadStream('resources/visitors_grouping.csv');
        Papa.parse(file, {
            header: true,
            transformHeader: function (h) {
                return h.trim();
            },
            complete: function (results) {
                let grouping = adjustGroupData(results.data);
                dbAPI.insertDocument(grouping,'visitors_grouping');
                updateStats(grouping).then(r => {});
            }
        });
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
        return {group_ID: key, visitors_ID: group_to_values[key], day : new Date(utils.getToday())};
    });
}

//given a list of groups, update number_of_groups and average_group_size in the database
//newAverageGroupSize = sum of the sizes of the new groups
// + ( average group size in the database * number of groups in the database ))
// / ( number of groups in the database + number of new groups)
async function updateStats(groupings){
    let numberOfNewGroups = groupings.length;
    let sumOfGroupsSizes = getSumOfGroupsSizes(groupings);

    //update total stats
    await totalStats.getTotalStats().then((stats) => {
        let newNumberOfGroups = numberOfNewGroups + stats.number_of_groups;
        let newAverageGroupSize = (sumOfGroupsSizes + ( stats.average_group_size * stats.number_of_groups ))
            /( newNumberOfGroups );

        totalStats.updateTotalStats(newAverageGroupSize, newNumberOfGroups, {
            average_group_size: newAverageGroupSize,
            number_of_groups: newNumberOfGroups
        });
    });
    //update daily stats
    await dailyStats.getDailyStats(new Date(utils.getToday())).then((stats) => {
        let newNumberOfGroups = numberOfNewGroups + stats.number_of_groups;
        let newAverageGroupSize = (sumOfGroupsSizes + ( stats.average_group_size * stats.number_of_groups ))
            /( newNumberOfGroups );

        dailyStats.updateDailyStats(newAverageGroupSize, newNumberOfGroups, {
            average_group_size: newAverageGroupSize,
            number_of_groups: newNumberOfGroups
        });
    });
}

function getSumOfGroupsSizes(groupings){
    let sumOfGroupSizes = 0;
    for(const group of groupings){
        sumOfGroupSizes += group.visitors_ID.length;
    }
    return sumOfGroupSizes;
}


