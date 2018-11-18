var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    username: String,
    password: String,
    isManager: Boolean,
    isDisabled: Boolean
});

module.exports = mongoose.model('User',userSchema);