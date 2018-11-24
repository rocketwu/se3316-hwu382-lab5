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
    });

router.route('/:id1')
    .get(function (req, res) {
        console.log(req.params.id1);
        res.sendStatus(200);
    })

router.route('/:id1/:id2')
    .get(function (req, res) {
        console.log(req.params.id1 + ' ' + req.params.id2);
        res.sendStatus(200);
    })


module.exports=router;