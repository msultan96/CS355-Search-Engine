var Crawler = require("crawler");
var validUrl = require('valid-url');
const mongoose = require('mongoose');
require('../models/Search');
const search = mongoose.model('Search');
var temp = new Array();
var display = require('./displayData');

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
                    if(typeof $ !== 'function') return;
                    var page = result.body;
                    var lang = $(result.body).closest('[lang]').attr('lang') || 'en';
                    if(lang.includes('en')){
                        var res = count(query, page);
                        if(res > 0){
                            if(typeof $ !== 'function') return
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
