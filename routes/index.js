var express = require('express');
var router = express.Router();
let totalStats = require('../public/javascripts/collections/total_stats');
let dbAPI = require('../public/javascripts/collections/database_API');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.format({
    'application/json': function () {
      res.json({ user: 'tobi' })
    }
  })
});

module.exports = router;
