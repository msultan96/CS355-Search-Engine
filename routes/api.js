var express = require('express');
var Crawler = require("crawler");
var validUrl = require('valid-url');
var router = express.Router();
var mongoose = require('mongoose');
var cors = require('cors');
var Search = require('../models/Search');
var queryCrawler = require('../helpers/crawler');
require('../models/Search');
const search = mongoose.model('Search');
var display = require('../helpers/displayData');
var cheerio = require('cheerio');

var temp = [];

function parseHrtimeToSeconds(hrtime) {
    var seconds = (hrtime[0] + (hrtime[1] / 1e9)).toFixed(3);
    return seconds;
}

router.get('/search/:query', function(req, res, next) {
    const { query } = req.params;
    search.find({ name: query },
        function(err, data) {
            if(data.length > 0){
                console.log("Already in database");
                temp = display(query);
                res.render('search', { title: 'CS355 Search', data: temp});
            } else {
                search.create({
                    name: query,
                    links: [],
                })
                // var startTime = process.hrtime();
                queryCrawler(query)
                    .then(() => {
                         // var elapsed = parseHrtimeToSeconds(process.hrtime(startTime));
                        // search.findOneAndUpdate({ name:query },
                        //     { time: elapsed },
                        //     function(err, stu) {
                        //     });
                        //res.render('search', { title: 'CS355 Search' });
                        var blank = [];
                        temp = blank;
                        temp = display(query);
                        res.redirect('/api/search/'+query);

                        //res.render('search', { title: 'CS355 Search', data: temp });
                    })
                    .catch(() => {
                        res.send('crawler screwed up');
                    })
            }
        });
});

module.exports = router;
