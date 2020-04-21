module.exports = {
    groupBy:  function (objectArray, property)
    {
        return objectArray.reduce(function (acc, obj) {
            let key = obj[property];
             if (!acc[key]) {
            acc[key] = []
        }
        acc[key].push(obj);
        return acc
         }, {});
    },

    getToday: function() {
        return new Date().toJSON().slice(0, 10).replace(/-/g, '-');
    },

    //in seconds
    getTimeSpent: function(start,end) {
        return getTimeSpent(start,end);
    },

    isFirstTimestampGreaterThanSecond : function(first,second){
        return(getTimeSpent(first,second) < 0);
    }
};

function getTimeSpent(start,end) {
    let startDate = new Date("1/1/1970 " + start);
    let endDate = new Date("1/1/1970 " + end);
    return (endDate.getTime() - startDate.getTime()) / 1000;
}


