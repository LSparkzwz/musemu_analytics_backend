/*
daily_stats is a collection whose documents follow the following structure:
{
    day: ...
	visitors_per_hour_in_general : {
 		hour_1 : ...,
 		hour_2 : ...
	},
 	rooms : {
 		room_1 : {
 		    visitors_per_hour : {
 				hour_1 : ...,
 				hour_2 : ...
 			},
 		room_2 : ...
	},
 	POI : {
        	POI_1 : {
        		daily_attraction_power : ...,
        		daily_holding_power : ...
        		},
 	},
 	total_number_of_groups : ...,
 	total_number_of_visitors : ...,
 	average_group_size : ...,
 	average_group_time_in_museum : ....,
 	average_visitor_time_in_museum : ....,
}
 */


function DailyStats(){
    Stats.call(this);
    this.day = '';
    this.visitors_per_hour = [];
    this.visitors_per_room_per_hour = [];
}
DailyStats.prototype = Object.create(Stats.prototype);
DailyStats.prototype.constructor = DailyStats;