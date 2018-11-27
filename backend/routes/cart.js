var express = require('express');
var router = express.Router();
var loginModule = require('../backend_modules/login_module');

var Item = require('../models/itemModel');
var Cart = require('../models/cartModel');

router.use(function (req, res, next) {
    console.log('===Receive a request about shopping cart===');
    next();
});

router.route('/')
    .get(loginModule.verifyLoginToken, function (req, res) {
        //request to get all items in the shopping cart
        //use: GET http://myurl/cart/
        //login user only
        loginModule.verifyAuthority(req, res, false, function (user) {
            Cart.find({userID: user._id}, function (err, cartItems) {
                if (err){
                    res.json({status: '0', message: err});
                }else{
                    res.json(cartItems);
                }
            })
        })
    })

    .delete(loginModule.verifyLoginToken, function (req, res) {
        //request to clear the cart
        //use: DELETE http://myurl/cart
        //login user only
        loginModule.verifyAuthority(req, res, false, function (user) {
            Cart.find({userID: user._id}, function (err, items) {
                if(err){
                    res.json({status: '0', message: err});
                }else{
                    for(let i=items.length-1;i>=0;i--){
                        console.log(items[i].itemID);
                        items[i].remove(function (err, itemRemoved) {
                            if (err){
                                res.json({status: '0', message: err});
                            }else{
                                Item.findById(items[i].itemID, function (err, item) {
                                    if(err){
                                        console.log(err);
                                    }else if (item){
                                        item.available = item.available + itemRemoved.quantity;
                                        item.save(function (err) {
                                            if(err){
                                                console.log(err);
                                            }else{
                                                console.log('update item available quantity: '+item.name);
                                            }
                                        })
                                    }
                                });
                            }
                        });
                    }
                    res.json({status: '1', message: 'Success delete item from cart'});
                }
            });
        });
    });

router.route('/item/:item_id')
    .delete(loginModule.verifyLoginToken, function (req, res) {
        //request to delete a item in the shopping cart
        //use: DELETE http://myurl/cart/item/<item_id>
        //login user only

        loginModule.verifyAuthority(req, res, false, function (user) {
            Cart.findOne({userID: user._id, itemID: req.params.item_id}, function (err, cartItem) {
                if(err){
                    res.json({status: '0', message: err});
                }else{
                    cartItem.remove(function (err, itemRemoved) {
                        if (err){
                            res.json({status: '0', message: err});
                        }else{
                            Item.findById(req.params.item_id, function (err, item) {
                                if(err){
                                    console.log(err);
                                }else if (item){
                                    item.available = item.available + itemRemoved.quantity;
                                    item.save(function (err) {
                                        if(err){
                                            console.log(err);
                                        }else{
                                            console.log('update item available quantity: '+item.name);
                                        }
                                    })
                                }
                            });
                            res.json({status: '1', message: 'Success delete item from cart'});
                        }
                    });
                }
            });
        });
    })

    .put(loginModule.verifyLoginToken, function (req, res) {
        //request to add an item to the cart (of if the item exist, update the quantity in the cart)
        //use PUT http://myurl/cart/<item_id>
        //put body: {quantity}
        //login user only
        loginModule.verifyAuthority(req, res, false, function (user) {
            //check whether the item exist
            var quantity = req.body.quantity;
            if(quantity<0||typeof quantity =='undefined'){
                res.json({status: '0', message: 'invalid quantity'});
                return;
            }
            Item.findById(req.params.item_id, function (err, item) {
                if(err){
                    console.log(err);
                }
                if (item){

                    //find the item in user's cart
                    Cart.findOne({userID: user._id, itemID: req.params.item_id}, function (err, cartItem) {
                        if(err){
                            res.json({status: '0', message: err});
                        }else{

                            if(cartItem){
                                item.available=cartItem.quantity+item.available;    //assume no item in cart
                                //item has already been in cart
                                if (quantity > item.available){
                                    res.json({status: '0', message: 'exceed the available'});
                                    return;
                                }
                                cartItem.quantity = quantity;
                                cartItem.save(function (err) {
                                    if (err){
                                        res.json({status: '0', message: err});
                                    } else{
                                        res.json({status: '1',message: 'Item quantity updated'});
                                    }
                                })
                            }else{
                                //create a new instance for the item
                                if (quantity > item.available){
                                    res.json({status: '0', message: 'exceed the available'});
                                    return;
                                }
                                let cartItem = new Cart();
                                cartItem.userID = user._id;
                                cartItem.itemID = item._id;
                                cartItem.itemName = item.name;
                                cartItem.itemPrice = item.price;
                                cartItem.quantity = quantity;
                                cartItem.availableQ = item.available;
                                cartItem.save(function (err) {
                                    if (err){
                                        res.json({status: '0', message: err});
                                    } else{

                                        res.json({status: '1',message: 'Item added'});
                                    }
                                })
                            }
                            //update available quantity of item
                            item.available=item.available-quantity;
                            item.save(function (err) {
                                if (err) console.log(err);
                                else console.log('update item available quantity: '+item.name);
                            })
                        }
                    })

                }else{
                    res.json({status: '0', message: 'Item not exist!'});
                }
            });
        })
    });

router.route('/buy')
    .delete(loginModule.verifyLoginToken, function (req, res) {
        //request to buy the cart
        //use: DELETE http://myurl/cart/buy
        //login user only
        loginModule.verifyAuthority(req, res, false, function (user) {
            Cart.find({userID: user._id}, function (err, items) {
                if(err){
                    res.json({status: '0', message: err});
                }else{
                    for(let i=items.length-1;i>=0;i--){
                        console.log(items[i].itemID);
                        items[i].remove(function (err, itemRemoved) {
                            if (err){
                                res.json({status: '0', message: err});
                            }else{
                                Item.findById(items[i].itemID, function (err, item) {
                                    if(err){
                                        console.log(err);
                                    }else if (item){
                                        item.sold = item.sold + itemRemoved.quantity;
                                        item.save(function (err) {
                                            if(err){
                                                console.log(err);
                                            }else{
                                                console.log('update item sold quantity: '+item.name);
                                            }
                                        })
                                    }
                                });
                            }
                        });
                    }
                    res.json({status: '1', message: 'Success buy items in cart'});
                }
            });
        });
    });

module.exports=router;