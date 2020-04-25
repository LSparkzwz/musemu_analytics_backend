function TotalStats(){
    Stats.call(this);
}
TotalStats.prototype = Object.create(Stats.prototype);
TotalStats.prototype.constructor = TotalStats;