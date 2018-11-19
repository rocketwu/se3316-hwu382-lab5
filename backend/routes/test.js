var express = require('express');
var router = express.Router();
var ENV = require('../backend_modules/environment');
var loginModule = require('../backend_modules/login_module');
var jwt = require('jsonwebtoken');


router.use(loginModule.verifyLoginToken,function (req, res, next) {
    console.log('===Receive a signup request===');
    next();
});

router.route('/')
    .get(function (req,res) {
        jwt.verify(req.token, ENV.secretKey, (err, payload)=>{
            if(err){
                res.json({status: '0', messge: 'Login status expired'});
            }else {
                res.json({message:'success',id:payload.UserID});
            }
        })
    })


module.exports=router;