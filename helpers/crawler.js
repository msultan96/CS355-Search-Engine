/*

var express = require('express');
var router = express.Router();
var Crawler = require("crawler");
var validUrl = require('valid-url');
var mongoose = require("mongoose");
var Search = require('../models/Search');
var searchApi = require('../routes/api');

var crawlerLength=0;

function queryCrawler(query){
        return new Promise((resolve, reject) => {
            var maxDepth = 25;
            var depth = 0;
            var c = new Crawler({
                maxConnections : 10,
                callback : function (error, result, done) {
                    if(error){
                        return;
                    }else{
                        var $ = result.$;
                        var page = result.body;

                        var res = count(query, page);
                        var search = new Search();

                        if(res > 0){
                            if(typeof $ !== 'function') return;

                            router.route('/search/:query').put(function(req, res){
                                Search.findById(req.params.query, function(err, search){
                                    if(err) res.send(err);

                                    search.result.href.push(result.request.uri.href);
                                    search.result.title.push($("title").text());
                                    var desc = $("meta[name]").attr("content");
                                    if(!(typeof desc === "undefined"))
                                        if(desc.toString.length >=1)
                                            search.result.desc.push(desc);

                                    search.save(function(err){
                                        if(err) res.send(err);
                                        res.json({message: 'query updated ' + search._id});
                                    })
                                })
                            });
                        }

                        depth++;

                        if(typeof $ !== 'function') return;
                        $("a").each(function(index,a){
                            if (validUrl.isWebUri(a.attribs.href)){
                                c.queue(a.attribs.href);
                            }
                        });
                    }

                    if(depth >= maxDepth){
                        resolve();
                        return;
                    }
                    done();
                }
            });

            var link = `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`;
            console.log(`link = ${link}`);
            c.queue(link);
        })
    };
}

function count (query, str) {
	const re = new RegExp(query, 'g');
	return ((str || '').match(re) || []).length
}

module.exports = queryCrawler;

*/

var Crawler = require("crawler");
var validUrl = require('valid-url');
const mongoose = require('mongoose');

function queryCrawler(query){
    return new Promise((resolve, reject) => {
        var maxDepth = 25;
        var depth = 0;
        var c = new Crawler({
            maxConnections : 10,
            callback : function (error, result, done) {
                if(error){
                    return;
                }else{
                    var $ = result.$;
                    var page = result.body;

                    var res = count(query, page);
                    if(res > 0){
                        if(typeof $ !== 'function') return
                        // console.log("Depth = " + depth);
                        console.log(result.request.uri.href)
                        console.log($("title").text())
                    }

                    depth++;

                    if(typeof $ !== 'function') return
                    $("a").each(function(index,a){
                        if (validUrl.isWebUri(a.attribs.href)){
                            c.queue(a.attribs.href);
                        }
                    });
                }

                if(depth >= maxDepth){
                    resolve();
                    return;
                }
                done();
            }
        });

        var link = `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`;
        console.log(`link = ${link}`)
        c.queue(link);
    })
}

function count (query, str) {
    const re = new RegExp(query, 'g');
    return ((str || '').match(re) || []).length
}

module.exports = queryCrawler;
