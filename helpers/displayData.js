var mongoose = require('mongoose');
require('../models/Search');
const search = mongoose.model('Search');
var temp = [];

function display(query){
    search.findOne({ name: query },
        function(err, stu) {
            if (stu === null) {
                console.log("No student found");
            } else {
                temp = stu.links;
                temp.sort((a,b) => (a.relevancy > b.relevancy) ? -1 : ((b.relevancy > a.relevancy) ? 1 : 0));

                temp.map(function(element){
                    //write jquery here
                    //console.log(element.url);
                })
            }
        });
    return temp;
}

module.exports = display;
