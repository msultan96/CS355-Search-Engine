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
