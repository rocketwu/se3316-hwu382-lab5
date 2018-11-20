var express = require('express');
var router = express.Router();
var Item = require('../models/itemModel');
var loginModule = require('../backend_modules/login_module');
var ENV = require('../backend_modules/environment');
var jwt = require('jsonwebtoken');
var User = require('../models/userModel');


var parsetoItem = function (request){
    var item = new Item(request.body.item);
    return (!item.name) ? parsetoItem2(request) : item;
}

var parsetoItem2 = function (request){
    let item = new Item();
    item.name = request.body.name;
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
        //post body: {name, available, [sold], detail}
        //only store manager can do
        jwt.verify(req.token, ENV.secretKey, (err, payload) => {
            if (err) {
                res.json({status: '0', message: 'Login status expired'});
            } else {
                //use the user id in payload to check the user is a manager or not
                let userID = payload.UserID;
                User.findById(userID, function (err, user) {
                    if (err) {
                        res.json({status: '0', message: 'Login status expired'});
                        return;
                    }
                    if (user) {
                        if (user.isManager) {
                            //user is the manager, can add item
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
                        } else {
                            res.json({status: '0', message: 'permission deny, need manager account'});
                        }
                    } else {
                        res.json({status: '0', message: 'Login status expired'});
                    }
                })
            }
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
    })

router.route('/:item_id')
    .put(loginModule.verifyLoginToken, function (req, res) {
        //request update item
        //use: PUT http://myurl/item/<item_id>
        //post body: {name, available, sold, detail}
        //only store manager can do
        jwt.verify(req.token, ENV.secretKey, (err, payload) => {
            if (err) {
                res.json({status: '0', message: 'Login status expired'});
            } else {
                //use the user id in payload to check the user is a manager or not
                let userID = payload.UserID;
                User.findById(userID, function (err, user) {
                    if (err) {
                        res.json({status: '0', message: 'Login status expired'});
                        return;
                    }
                    if (user) {
                        if (user.isManager) {
                            //user is the manager, can modify item
                            Item.findById(req.params.item_id, function (err, originItem) {
                                if(err){
                                    res.json({status: '0',message:err});
                                }else{
                                    let item = parsetoItem(req);
                                    //if the field is modified, save the change to the origin item
                                    if (item.name) originItem.name = item.name;
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
                            })
                        } else {
                            res.json({status: '0', message: 'permission deny, need manager account'});
                        }
                    } else {
                        res.json({status: '0', message: 'Login status expired'});
                    }
                })
            }
        });
    })

    .delete(loginModule.verifyLoginToken, function (req, res) {
        //request to delete an item
        //use: DELETE http://myurl/item/<item_id>
        //only store manager can do
        jwt.verify(req.token, ENV.secretKey, (err, payload) => {
            if (err) {
                res.json({status: '0', message: 'Login status expired'});
            } else {
                //use the user id in payload to check the user is a manager or not
                let userID = payload.UserID;
                User.findById(userID, function (err, user) {
                    if (err) {
                        res.json({status: '0', message: 'Login status expired'});
                        return;
                    }
                    if (user) {
                        if (user.isManager) {
                            //user is the manager, can delete item
                            Item.findByIdAndDelete(req.params.item_id, function (err, item) {
                                if (err){
                                    res.send(err);
                                }
                                if (item){
                                    res.json({status:'1', message: 'Item deleted'});
                                }else{
                                    res.json({status:'0', message: 'No such item'});
                                }
                            });
                        } else {
                            res.json({status: '0', message: 'permission deny, need manager account'});
                        }
                    } else {
                        res.json({status: '0', message: 'Login status expired'});
                    }
                })
            }
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
    })




module.exports=router;