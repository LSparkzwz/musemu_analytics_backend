let totalStats = require('./total_stats');
let dailyStats = require('./daily_stats');
let utils = require('../utils');

module.exports = {
    updateVisitorStats: async function (newStats){
        //update total stats
        await totalStats.getTotalStats().then((oldStats) => {
            updatedStats = setUpdatedVisitorStats(oldStats,newStats);
            totalStats.updateTotalStats(updatedStats);
        });
        //update daily stats
        let day = new Date('2020-04-19');
        await dailyStats.getDailyStats(day).then((oldStats) => {
            updatedStats = setUpdatedVisitorStats(oldStats,newStats);
            updatedStats.visitors_per_hour = newStats.visitorsPerHour;
            updatedStats.visitors_per_room_per_hour = newStats.visitorsPerRoomPerHour;
            dailyStats.updateDailyStats(updatedStats,day);
        });
    },
//given a list of groups, update number_of_groups and average_group_size in the database
//newAverageGroupSize = sum of the sizes of the new groups
// + ( average group size in the database * number of groups in the database ))
// / ( number of groups in the database + number of new groups)
    updateGroupStats : async function (groupings, date){
            let numberOfNewGroups = groupings.length;
            let sumOfGroupsSizes = getSumOfGroupsSizes(groupings);

            //update total stats
            await totalStats.getTotalStats().then((stats) => {
                let newNumberOfGroups = numberOfNewGroups + stats.number_of_groups;
                let newAverageGroupSize = (sumOfGroupsSizes + ( stats.average_group_size * stats.number_of_groups ))
                    /( newNumberOfGroups );

                totalStats.updateTotalStats({
                    average_group_size: newAverageGroupSize,
                    number_of_groups: newNumberOfGroups
                });
            });
            //update daily stats
            await dailyStats.getDailyStats(date).then((stats) => {
                let newNumberOfGroups = numberOfNewGroups + stats.number_of_groups;
                let newAverageGroupSize = (sumOfGroupsSizes + ( stats.average_group_size * stats.number_of_groups ))
                    /( newNumberOfGroups );

                dailyStats.updateDailyStats({
                    average_group_size: newAverageGroupSize,
                    number_of_groups: newNumberOfGroups
                }, date);
            });
        }
};

function setUpdatedVisitorStats(stats,newStats){
    let newNumberOfVisitors = newStats.visitors.length + stats.number_of_visitors;
    let totalVisitorTimeInMuseum = stats.average_visitor_time_in_museum * stats.number_of_visitors;
    let newVisitorTime = newStats.cumulativeVisitorTimeInMuseum + totalVisitorTimeInMuseum;
    let newAverageVisitorTime = (newStats.cumulativeVisitorTimeInMuseum + ( totalVisitorTimeInMuseum ))
        /( newNumberOfVisitors );
    let newAverageWatchedPresentations = (newStats.sumOfWatchedPresentations + ( stats.average_watched_presentations * stats.number_of_visitors  ))
        /( newNumberOfVisitors );
    for (let [key, value] of Object.entries(stats.POI)) {
        if(newStats.visitorsPerPOI.has(key)){
            value.total_attraction_power = (newStats.visitorsPerPOI.get(key) + value.total_attraction_power * stats.number_of_visitors) / newNumberOfVisitors;
        }

        if(newStats.cumulativeTimePerPOI.has(key)){
            value.total_holding_power = (newStats.cumulativeTimePerPOI.get(key) + value.total_holding_power * totalVisitorTimeInMuseum) / newVisitorTime;
        }
    }

    return {
        POI: stats.POI,
        number_of_visitors : newNumberOfVisitors,
        average_visitor_time_in_museum : newAverageVisitorTime,
        average_watched_presentations: newAverageWatchedPresentations
    }
}

function getSumOfGroupsSizes(groupings){
    let sumOfGroupSizes = 0;
    for(const group of groupings){
        sumOfGroupSizes += group.visitors_ID.length;
    }
    return sumOfGroupSizes;
}

