var mongoose = require('mongoose');
var schema = mongoose.Schema;

var linkSchema = new schema({
    links: [{
        url: String,
        title: String,
        desc: String,
        relevancy: Number,
    }]
}, {
    collection: 'Links'
});

module.exports = mongoose.model('Links', linkSchema);
