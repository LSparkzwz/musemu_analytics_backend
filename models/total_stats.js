function TotalStats(){
    Stats.call(this);
    this.average_visitors_per_hour = [];
    this.average_visitors_per_room_per_hour = [];
}
TotalStats.prototype = Object.create(Stats.prototype);
TotalStats.prototype.constructor = TotalStats;