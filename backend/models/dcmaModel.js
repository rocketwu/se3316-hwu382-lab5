var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dcmaSchema = new Schema({
    issuer: String,
    content: String,
    contact: String,
    done: Boolean
});

module.exports = mongoose.model('Dcma',dcmaSchema);