var mongoose = require('mongoose');
var schema = mongoose.Schema;

var searchSchema = new schema({
    name: { type: String, required: true },
    links: [{
        url: String,
        title: String,
        desc: String,
        relevancy: Number,
    }],
    date: {type : Date, default: Date.now},
    timeTaken: { type: Number}
}, {
    collection: 'Search'
});

module.exports = mongoose.model('Search', searchSchema);
