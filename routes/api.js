let express = require('express');
let router = express.Router();
let totalStats = require('../controllers/collections/total_stats');
let dailyStats = require('../controllers/collections/daily_stats');
let visitors = require('../controllers/collections/visitor');
let visitorGrouping = require('../controllers/collections/visitors_grouping');

router.get('/total_stats', function(req, res, next) {
    res.format({
        'application/json': async function () {
            let total_stats = await totalStats.getTotalStats()
            res.json(total_stats);
        }
    })
});

router.get('/daily_stats/:day', function(req, res, next) {
    res.format({
        'application/json': async function () {
            let daily_stats = await dailyStats.getDailyStats(new Date(req.params.day));
            res.json(daily_stats);
        }
    })
});

router.get('/visitors/all_ids', function(req, res, next) {
    res.format({
        'application/json': async function () {
            let query = { }
            let visitorIDs = await visitors.getVisitor(query);
            res.json(visitorIDs.map(visitor => visitor.visitor_ID));
        }
    })
});

router.get('/visitors/id/:id', function(req, res, next) {
    res.format({
        'application/json': async function () {
            let query = { visitor_ID : req.params.id }
            let visitor = await visitors.getVisitor(query);
            res.json(visitor);
        }
    })
});

router.get('/visitors/day_of_visit/:day', function(req, res, next) {
    res.format({
        'application/json': async function () {
            let query = { day_of_visit : new Date(req.params.day)}
            let visitor = await visitors.getVisitor(query);
            res.json(visitor);
        }
    })
});

router.get('/visitors/group/:id', function(req, res, next) {
    res.format({
        'application/json': async function () {
            let query = { group_ID : req.params.id }
            let visitor = await visitors.getVisitor(query);
            res.json(visitor);
        }
    })
});

router.get('/group/id/:id', function(req, res, next) {
    res.format({
        'application/json': async function () {
            let query = { group_ID : req.params.id }
            let group = await visitorGrouping.getGroup(query);
            res.json(group);
        }
    })
});

router.get('/group/day_of_visit/:day', function(req, res, next) {
    res.format({
        'application/json': async function () {
            let query = { day : new Date(req.params.day) }
            let group = await visitorGrouping.getGroup(query);
            res.json(group);
        }
    })
});

router.get('/upload/visitor', function(req, res, next) {
    res.format({
        'application/json': async function () {
            res.json(res);
        }
    })
});




module.exports = router;
