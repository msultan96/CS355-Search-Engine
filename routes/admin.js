var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
require('../models/Search');
const search = mongoose.model('Search');

router.get('/', function(req, res, next) {
    search.find({}, function(err, students) {
     console.log(students[0].links);
     students.map(function(element){
       console.log(element.links)
     })
    });
    res.render('admin', { title: 'CS355 Search' });
});

module.exports = router;
