var mongoose = require('mongoose');
var schema = mongoose.Schema;

var searchSchema = new schema({
    name: { type: String, required: true }
}, {
    collection: 'search'
});

module.exports = mongoose.model('Search', searchSchema);
