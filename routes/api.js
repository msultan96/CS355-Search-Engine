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
           console.log("Already in database");
           //get array of links from database at data[0].links and send value out to ejs and iterate through loop to post
         } else {
           search.create({
             name: query,
             links: []
           })
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
