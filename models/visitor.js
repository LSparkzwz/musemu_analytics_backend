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


class Visitor {
    constructor() {
        this.visitor_ID = '';
        this.group_ID = '';
        this.day_of_visit = '';
        this.position_log = [];
        this.presentations_log = [];
    }
}

module.exports = Visitor;