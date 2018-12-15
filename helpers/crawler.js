var Crawler = require("crawler");
var validUrl = require('valid-url');
const mongoose = require('mongoose');
require('../models/Search');
const search = mongoose.model('Search');
var temp = new Array();

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
                        // console.log(result.request.uri.href);
                        // console.log($("title").text());
                        temp.push({
                          url: result.request.uri.href,
                          title: $("title").text(),
                          relevancy: res
                        })

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
                    search.findOneAndUpdate({ name: query },
                      { links: temp },
                      function(err, stu) {
                      // console.log("done");
                    });
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
