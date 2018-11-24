var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var listSchema = new Schema({
    userID: String,
    name: String,
    description: String,
    isPublic: Boolean
});

module.exports = mongoose.model('List',listSchema);