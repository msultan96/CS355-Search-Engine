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

router.get('/search/:query', function(req, res, next) {
    const { query } = req.params;
    search.find({ name: query },
       function(err, data) {
         if(data.length > 0){
           console.log("Already in database");
             temp = display(query);
             console.log(temp);
             res.render('search', { title: 'CS355 Search', data: temp });
         } else {
           search.create({
             name: query,
             links: []
           })
           queryCrawler(query)
               .then(() => {
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
