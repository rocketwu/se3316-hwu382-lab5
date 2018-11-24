var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var listItemSchema = new Schema({
    listID: String,
    itemName: String,
    quantity: Number,
    itemID: String
});

module.exports = mongoose.model('ListItem',listItemSchema);