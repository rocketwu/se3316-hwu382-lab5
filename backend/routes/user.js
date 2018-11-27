var express = require('express');
var router = express.Router();
var User = require('../models/userModel');
var loginModule = require('../backend_modules/login_module');
var ENV = require('../backend_modules/environment');
var jwt = require('jsonwebtoken');



router.use(function (req, res, next) {
    console.log('===Receive a user request===');
    next();
})

router.route('/')
    .get(loginModule.verifyLoginToken, function (req, res) {
        User.find(function (err, users) {
            if (err) res.json({status: '0', message: err});
            else{
                res.json(users);
            }
        })
    });

router.route('/manager/:user_id')
    .put(loginModule.verifyLoginToken, function (req, res) {
        //request to change manager status of a user
        //use: PUT http://myurl/user/manager/<user_id>
        //post body: {isManager}
        //only store manager can do
        jwt.verify(req.token, ENV.secretKey, (err, payload) => {
            if (err) {
                res.json({status: '0', message: 'Login status expired'});
            } else {
                //use the user id in payload to check the user is a manager or not
                let userID = payload.UserID;
                User.findById(userID, function (err, user) {
                    if (err || user.isDisabled) {
                        res.json({status: '0', message: 'Login status expired'});
                        return;
                    }
                    if (user) {
                        if (user.isManager) {
                            //user is the manager, can modify status
                            User.findById(req.params.user_id, function (err, originUser) {
                                if(err){
                                    res.json({status: '0',message:err});
                                }else{
                                    originUser.isManager = req.body.isManager;
                                    originUser.save(function (err) {
                                        if (err) {
                                            res.json({status: '0', message: err});
                                        } else {
                                            res.json({status: '1', message: 'Manager status updated!'});
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
    });

router.route('/disable/:user_id')
    .put(loginModule.verifyLoginToken, function (req, res) {
        //request to change disable status of a user
        //use: PUT http://myurl/user/disable/<user_id>
        //post body: {isDisabled}
        //only store manager can do
        jwt.verify(req.token, ENV.secretKey, (err, payload) => {
            if (err) {
                res.json({status: '0', message: 'Login status expired'});
            } else {
                //use the user id in payload to check the user is a manager or not
                let userID = payload.UserID;
                User.findById(userID, function (err, user) {
                    if (err || user.isDisabled) {
                        res.json({status: '0', message: 'Login status expired'});
                        return;
                    }
                    if (user) {
                        if (user.isManager) {
                            //user is the manager, can modify status
                            User.findById(req.params.user_id, function (err, originUser) {
                                if(err){
                                    res.json({status: '0',message:err});
                                }else{
                                    originUser.isDisabled = req.body.isDisabled;
                                    originUser.save(function (err) {
                                        if (err) {
                                            res.json({status: '0', message: err});
                                        } else {
                                            res.json({status: '1', message: 'Disable status updated!'});
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
    });

module.exports=router;