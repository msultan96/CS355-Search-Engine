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
const ids = require('../models/IDs');

router.get('/search/:query', function(req, res, next) {
    const { query } = req.params;
    search.find({ name: query },
       function(err, data) {
         if(data.length > 0){
           //pull from datqbase
           console.log(data.length);
         } else {
             // ids.create({
             //     searchID: 123,
             //     linkID: 456
             // });


           //crawl
           queryCrawler(query)
               .then(() => {
                   res.render('search', { title: 'CS355 Search' });
               })
               .catch(() => {
                   res.send('crawler screwed up');
               })
         }
    });
});

module.exports = router;
