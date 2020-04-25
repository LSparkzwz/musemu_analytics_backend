const http = require('http');
const fs = require('fs');

const express = require('express');
const multer = require('multer');
const csv = require('fast-csv');
const router = express.Router;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('uploader', { title: 'Museum Analytics' });
});

router.post('/', upload.single('imageupload'),function(req, res) {
    res.send("File uploaded successfully.");
});


module.exports = router;
