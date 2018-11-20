var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var commentSchema = new Schema({
    authorID: String,
    itemID: String,
    author: String,
    content: String,
    rank: Number,
    isVisible: Boolean
});

module.exports = mongoose.model('Comment',commentSchema);