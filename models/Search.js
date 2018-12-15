var mongoose = require('mongoose');
var schema = mongoose.Schema;

var searchSchema = new schema({
    _id: String,
    result: [{
        href: String,
        title: String,
        desc: String,
        relevancy: Number,
    }],
    timeTaken: Number,
    lastSearched: {type: Date, default: Date.now},
}, {
    collection: 'searchCollection'
});

module.exports = mongoose.model('Search', searchSchema);

