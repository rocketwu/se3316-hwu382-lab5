var express = require('express');
var router = express.Router();
var loginModule = require('../backend_modules/login_module');

var Item = require('../models/itemModel');
var Comment = require('../models/commentModel');
var Cart = require('../models/cartModel');
var ListItem = require('../models/listItemModel');

var parsetoItem = function (request){
    var item = new Item(request.body);
    return (!item.name) ? parsetoItem2(request) : item;
}

var parsetoItem2 = function (request){
    let item = new Item();
    item.name = request.body.name;
    item.price=request.body.price;
    item.available = request.body.available;
    item.sold = request.body.sold;
    item.detail = request.body.detail;
    return item;
}

router.use(function (req, res, next) {
    console.log('===Receive a request about item===');
    next();
})

router.route('/')
    .post(loginModule.verifyLoginToken, function (req, res) {
        //request add item
        //use: POST http://myurl/item/
        //post body: {name, price, [available], [sold], [detail]}
        //only store manager can do
        loginModule.verifyAuthority(req, res, true, function () {
            let item = new Item(parsetoItem(req));
            //if the field is undefined, set to default value
            if (!item.sold) item.sold=0;
            if (!item.available) item.available=0;
            if (!item.detail) item.detail='';
            item.save(function (err) {
                if (err) {
                    res.json({status: '0', message: err});
                } else {
                    res.json({status: '1', message: 'item added!'});
                }
            })
        });
    })

    .get(function (req, res) {
        Item.find(function (err, items) {
            //request to get all items
            //use: GET http://myurl/item/
            if (err) res.json({status: '0', message: err});
            else{
                res.json(items);
            }
        })
    });

router.route('/:item_id')
    .put(loginModule.verifyLoginToken, function (req, res) {
        //request update item
        //use: PUT http://myurl/item/<item_id>
        //put body: {name, price, available, sold, detail}
        //only store manager can do
        loginModule.verifyAuthority(req, res, true, function () {
            Item.findById(req.params.item_id, function (err, originItem) {
                if(err){
                    res.json({status: '0',message:err});
                }else{
                    let item = parsetoItem(req);
                    //if the field is modified, save the change to the origin item
                    if (item.name) originItem.name = item.name;
                    if (item.price) originItem.price = item.price;
                    if (item.sold) originItem.sold = item.sold;
                    if (item.available) originItem.available = item.available;
                    if (item.detail) originItem.detail = item.detail;
                    originItem.save(function (err) {
                        if (err) {
                            res.json({status: '0', message: err});
                        } else {
                            res.json({status: '1', message: 'item updated!'});
                        }
                    })
                }
            });
        });
    })

    .delete(loginModule.verifyLoginToken, function (req, res) {
        //request to delete an item
        //use: DELETE http://myurl/item/<item_id>
        //only store manager can do

        loginModule.verifyAuthority(req, res, true, function () {
            Item.findByIdAndDelete(req.params.item_id, function (err, item) {
                if (err){
                    res.send(err);
                }
                if (item){
                    res.json({status:'1', message: 'Item deleted'});
                    Comment.deleteMany({itemID: req.params.item_id}, function (err) {});   //delete related comment
                    Cart.deleteMany({itemID: req.params.item_id}, function (err) {});   //delete related item in cart
                    ListItem.deleteMany({itemID: req.params.item_id}, function (err) {});   //delete relate item in wished list
                }else{
                    res.json({status:'0', message: 'No such item'});
                }
            });
        });
    })

    .get(function (req, res) {
        //request to get single item
        //use: GET http://myurl/item/<item_id>
        Item.findById(req.params.item_id, function (err, item) {
            if (err) res.json({status: '0', message: err});
            else{
                res.json(item);
            }
        })
    });




module.exports=router;