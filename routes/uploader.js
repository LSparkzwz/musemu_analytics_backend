const http = require('http');
const fs = require('fs');

const express = require('express');
const multer = require('multer');
const router = require('express').Router();
let visitor = require('../controllers/collections/visitor');
let visitorGrouping = require('../controllers/collections/visitors_grouping');

/*// SET STORAGE
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})*/
/*let upload = multer({ storage: storage })*/

let storage = multer.memoryStorage();
let upload = multer({ storage: storage });

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('uploader', { title: 'Museum Analytics' });
});


router.post('/addGrouping', upload.single('Grouping'), (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error)
    }
    visitorGrouping.insertGrouping(file, file.originalname);
    res.send("File uploaded")
});

router.post('/addVisitors', upload.array('Visitors'), (req, res, next) => {
    const files = req.files;
    if (!files) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error)
    }
    visitor.updateVisitors(files);
    res.send("File/s uploaded")
});

module.exports = router;
