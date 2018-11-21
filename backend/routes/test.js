var express = require('express');
var router = express.Router();
var loginModule = require('../backend_modules/login_module');


router.use(loginModule.verifyLoginToken,function (req, res, next) {
    console.log('===Receive a signup request===');
    next();
});

router.route('/')
    .get(function (req,res) {
        loginModule.verifyAuthority(req, res, false, function (user) {
            console.log('user '+user._id);
            res.json(user);
        })
    })


module.exports=router;