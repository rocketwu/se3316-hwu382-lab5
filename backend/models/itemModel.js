var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var itemSchema = new Schema({
    name: String,
    price: Number,
    available: Number,
    sold: Number,
    detail: String
});

module.exports = mongoose.model('Item',itemSchema);