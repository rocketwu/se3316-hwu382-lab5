var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var cartSchema = new Schema({
    userID: String,
    itemID: String,
    itemName: String,
    itemPrice: Number,
    quantity: Number
});

module.exports = mongoose.model('Cart',cartSchema);