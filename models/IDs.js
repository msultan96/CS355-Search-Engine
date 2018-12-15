var mongoose = require('mongoose');
var schema = mongoose.Schema;

var idSchema = new schema({
    searchID: Number,
    linkID: Number,
}, {
    collection: 'IDs'
});

module.exports = mongoose.model('IDs', idSchema);

