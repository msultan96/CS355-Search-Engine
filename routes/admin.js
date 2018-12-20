var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
require('../models/Search');
const search = mongoose.model('Search');
var async = require('async');
//
// const searches = async function(params) {
//     try { }
// }

router.get('/', function(req, res, next) {
    var count =0;
    var array = new Array();
    search.find({}, function(err, elements){
        async.waterfall([
            function(callback){
                elements.map(function(element){
                    array.push(element);
                });
                callback(null, array);
            },
            function(array, callback){
                res.render('admin', { title: 'CS355 Search', data:array});
            }
        ])
    });
    /*
    async.series([
        function (callback) {
            var data = new Array();
            search.find({}, function (err, elements) {
                elements.map(function(element){
                    console.log(element);
                    console.log("------------------ " + count++ + " ------------");

                })
            });
            callback(null, data);
        },
        function(arg1, callback){
            console.log("Finished??");
        }
    ], function (err, results) {
    });
    */
});

module.exports = router;
