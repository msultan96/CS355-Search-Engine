var Crawler = require("crawler");
var validUrl = require('valid-url');
const mongoose = require('mongoose');
require('../models/Search');
const search = mongoose.model('Search');
var temp = new Array();
var display = require('./displayData');

function queryCrawler(query){
    return new Promise((resolve, reject) => {
        var maxDepth = 100;
        var depth = 0;
        var c = new Crawler({
            maxConnections : 10,
            callback : function (error, result, done) {
                if(error){
                    return;
                }else{
                    var $ = result.$;
                    if(typeof $ !== 'function') return;
                    var page = result.body;
                    var lang = $(result.body).closest('[lang]').attr('lang') || 'en';
                    //console.log(lang);
                    if(lang.includes('en')){
                        var res = count(query, page);
                        if(res > 0){
                            if(typeof $ !== 'function') return
                            // console.log(result.request.uri.href);
                            // console.log($("title").text());
                            var desc = $('meta[name="description"]').attr('content') || "[ No Description Available ... ]";
                            temp.push({
                                url: result.request.uri.href,
                                title: $("title").text(),
                                desc: desc,
                                relevancy: res
                            })
                        }
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
                    // depth = 0;
                    //display gets called multiple times, need to find a way to call it once
                    // console.log(temp);
                    var arr = temp;
                    arr.sort((a,b) => (a.relevancy > b.relevancy) ? -1 : ((b.relevancy > a.relevancy) ? 1 : 0));
                    console.log("Iteration 1");
                    display(arr);
                    // display(temp.sort((a,b) => (a.relevancy > b.relevancy) ? -1 : ((b.relevancy > a.relevancy) ? 1 : 0)))
                    //as soon as resolve gets called, it displays page
                    resolve();
                    return;
                }
                done();
            }
        });

        // var arr = temp;
        // arr.sort((a,b) => (a.relevancy > b.relevancy) ? -1 : ((b.relevancy > a.relevancy) ? 1 : 0));
        // console.log("Iteration 1");
        // display(arr);

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
