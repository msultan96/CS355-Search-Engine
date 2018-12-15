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

/*
router.use(function(req, res, next){
    console.log("Route Test");
    next();
});

router.get('/', function(req, res){
    res.json({message: 'Route Test JSON Message'});
});
*/

/*
router.route('/search')
    .post(function(req, res) {

        //create query (accessed at POST http:// ... :3000/api/search)
        var search = new Search();
        search._id = req.body._id;

        search.save(function(err) {
            if(err)
                res.send(err);
            res.json({message: 'Searched for ' + req.body._id});
        });
    })
    //get all query (accessed at POST http:// ... :3000/api/search)
    .get(function(req, res) {
        Search.find(function(err, search) {
            if(err)
                res.send(err);
            res.json(search);
        })
    });

router.route('/search/:search_id')
    // get the search with id (accessed at GET http:// ... :3000/api/search/:search_id)
    .get(function(req, res){
        Search.findById(req.params.search_id, function(err, search){
            if(err)
                res.send(err);
            res.json(search);
        });
    })

    //update search w/ id
    .put(function(req, res){
        Search.findById(req.params.search_id, function(err, search){
            if(err) res.send(err);


            search.save(function(err){
                if(err) res.send(err);
                res.json({message: 'query updated ' + search._id});
            })
        })
    });

/*
router.get('/search/:query', cors(), function(req, res) {
    const { query } = req.params.query;
    uQuery.find({
        'request': query
    }, function(error, result) {
        if(error){
            queryCrawler(query)
                .then(() => {
                    res.send('crawler finished');
                })
                .catch(() => {
                    res.send('crawler screwed up');
                })
        }
        if(result) {
            res.send.json(result);
        } else {
            queryCrawler(query)
                .then(() => {
                    res.send('crawler finished');
                })
                .catch(() => {
                    res.send('crawler screwed up');
                })
        }
    })
});*/

router.get('/search/:query', function(req, res, next) {
    const { query } = req.params;
    search.find({ name: query },
       function(err, data) {
         if(data.length > 0){
           //pull from datqbase
           console.log(data.length);
         } else {
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
