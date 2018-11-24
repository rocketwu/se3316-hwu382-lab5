var express = require('express');
var router = express.Router();
var loginModule = require('../backend_modules/login_module');

var List = require('../models/listModel');
var ListItem = require('../models/listItemModel');
var Item = require('../models/itemModel');

router.use(loginModule.verifyLoginToken,function (req, res, next) {
    console.log('===Receive a list request===');
    next();
});

router.route('/own')    //用于get自己的表
    .get(function (req, res) {
        //request to get all the lists of the user
        //use: GET http://myurl/list/own/
        //login required
        loginModule.verifyAuthority(req, res, false, function (user) {
            List.find({userID: user._id}, function (err, lists) {
                if (err){
                    res.json({status: '0', message: err});
                }else{
                    res.json(lists);
                }
            })
        })
    })

    .post(function (req, res) {
        //require to create a new list
        //use: POST http://myurl/list/own
        //post body: {name, [description], [isPublic]}
        loginModule.verifyAuthority(req, res, false, function (user) {
            var newList = new List();
            newList.userID = user._id;
            newList.name = req.body.name;
            newList.description = req.body.description;
            newList.isPublic = false;
            if (req.body.isPublic) newList.isPublic = req.body.isPublic;
            newList.save(function (err) {
                if (err) res.json({status: '0', message: err});
                else res.json({status: '1', message: 'List added!'});
            });
        })
    });


router.route('/own/:list_id')   //用于get自己表的详细内容
    .get(function (req, res) {
        //request to get items in a list
        //use: GET http://myurl/list/own/<list_id>
        //login user only
        loginModule.verifyAuthority(req, res, false, function (user) {
            List.findOne({userID: user._id, _id: req.params.list_id}, function (err, list) {
                //check whether the user owned the list
                if (err){
                    res.json({status: '0', message: err});
                    return;
                }
                if(list){
                    //user owns the list
                    ListItem.find({listID: req.params.list_id}, function (err, items) {
                        if (err){
                            res.json({status: '0', message: err});
                            return;
                        }
                        res.json(items);
                    })
                }else{
                    res.json({status: '0', message: 'Cannot find such list'});
                }
            })
        });
    })

    .post(function (req, res) {
        //use to add an item into list
        //use: POST http://myurl/list/own/<list_id>
        //post body: {itemName, quantity, itemID}
        loginModule.verifyAuthority(req, res, false, function (user) {
            List.findOne({userID: user._id, _id: req.params.list_id}, function (err, list) {
                //check whether the user owned the list
                if (err){
                    res.json({status: '0', message: err});
                    return;
                }
                if(list){
                    //user owns the list
                    var newItem = new ListItem();
                    newItem.listID = list._id;
                    newItem.itemName = req.body.itemName;
                    newItem.quantity = req.body.quantity;
                    newItem.itemID = req.body.itemID;
                    newItem.save(function (err) {
                        if (err) res.json({status: '0', message: err});
                        else res.json({status: '1', message: 'Item added to list!'});
                    })
                }else{
                    res.json({status: '0', message: 'Cannot find such list'});
                }
            });
        });
    })

    .put(function (req, res) {
        //use to modify a list
        //use: PUT http://myurl/list/own/<list_id>
        //put body: {name, description, isPublic}
        loginModule.verifyAuthority(req, res, false, function (user) {
            List.findOne({userID: user._id, _id: req.params.list_id}, function (err, list) {
                //check whether the user owned the list
                if (err){
                    res.json({status: '0', message: err});
                    return;
                }
                if(list){
                    //user owns the list
                    if (req.body.name) list.name = req.body.name;
                    if (req.body.description) list.description = req.body.description;
                    if (typeof req.body.isPublic !== "undefined") list.isPublic = req.body.isPublic;
                    list.save(function (err) {
                        if (err) res.json({status: '0', message: err});
                        else    res.json({status: '1', message: 'list modified'});
                    })
                }else{
                    res.json({status: '0', message: 'Cannot find such list'});
                }
            })
        })
    });

router.route('/own/:list_id/:item_id')  //用于修改表内特定物品
    .put(function (req, res) {
        //use to change the quantity of a item
        //use: PUT http://myurl/list/own/<list_id>/<item_in_list_id>
        //put body: {quantity}
        let listid = req.params.list_id,
            itemid = req.params.item_id;
        loginModule.verifyAuthority(req, res, false, function (user) {
            List.findOne({userID: user._id, _id: listid}, function (err, list) {
                //check whether the user owned the list
                if (err){
                    res.json({status: '0', message: err});
                    return;
                }
                if(list){
                    //user owns the list
                    ListItem.findOne({listID: listid, itemID: itemid}, function (err, listItem) {
                        if (err){
                            res.json({status: '0', message: err});
                            return;
                        }
                        if (listItem){
                            listItem.quantity = req.body.quantity;
                            listItem.save(function (err) {
                                if (err) res.json({status: '0', message: err});
                                else res.json({status: '1', message: 'List: item quantity updated!'});
                            })
                        }
                    });
                }else{
                    res.json({status: '0', message: 'Cannot find such list'});
                }
            });
        });
    })

    .delete(function (req, res) {
        //use to delete an item in the list
        //use: DELETE http://myurl/list/own/<list_id>/<item_in_list_id>
        //login user required
        let listid = req.params.list_id,
            itemid = req.params.item_id;
        loginModule.verifyAuthority(req, res, false, function (user) {
            List.findOne({userID: user._id, _id: listid}, function (err, list) {
                //check whether the user owned the list
                if (err){
                    res.json({status: '0', message: err});
                    return;
                }
                if(list){
                    //user owns the list
                    ListItem.findOneAndDelete({listID: listid, itemID: itemid}, function (err, listItem) {
                        if (err) res.json({status: '0', message: err});
                        else res.json({status: '1', message: 'List: success delete the item!'});
                    });
                }else{
                    res.json({status: '0', message: 'Cannot find such list'});
                }
            });
        });
    });


router.route('/public/:user_id')    //查看他人的公开表
    .get(function (req, res) {
        //use to get other user's public list
        //GET http://myurl/list/public/<user_id>
        //login requested
        let userid = req.params.user_id;
        loginModule.verifyAuthority(req, res, false, function (user) {
            List.find({userID: userid, isPublic: true}, function (err, lists) {
                if (err){
                    res.json({status: '0', message: err});
                }else{
                    res.json(lists);
                }
            });
        });
    });

router.route('/public/:user_id/:list_id') //查看他人表的内容
    .get(function (req, res) {
        //use to get the content of a public user list
        //GET http://myurl/list/public/<user_id>/<list_id>
        //login requried
        let userid = req.params.user_id;
        let listid = req.params.list_id;
        loginModule.verifyAuthority(req, res, false, function (user) {
            //check if the list is public
            List.findOne({_id: listid, isPublic:true},function (err, list) {
                if (err){
                    res.json({status: '0', message: err});
                    return;
                }
                if(list){
                    //list is public
                    ListItem.find({listID: listid},function (err, itemsInlist) {
                        if (err){
                            res.json({status: '0',message: err});
                        }else{
                            res.json(itemsInlist);
                        }
                    })
                }else{
                    res.json({status: '0', message:'list not found'});
                }
            })
        })
    })

module.exports = router;