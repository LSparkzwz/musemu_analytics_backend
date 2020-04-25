var express = require('express');
var router = express.Router();
let totalStats = require('../controllers/collections/total_stats');
let dbAPI = require('../controllers/collections/database_API');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.format({
    'application/json': function () {

    }
  })
});

module.exports = router;
