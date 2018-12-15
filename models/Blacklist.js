var mongoose = require('mongoose');
var schema = mongoose.Schema;

var blacklistSchema = new schema({

    name: { type: String, required: true }
}, {
    collection: 'Blacklist'
});

module.exports = mongoose.model('Blacklist', blacklistSchema);
