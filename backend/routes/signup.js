var express = require('express');
var router = express.Router();
var User = require('../models/userModel');
var loginModule = require('../backend_modules/login_module');
var signupModule = require('../backend_modules/signup_module');
var ENV = require('../backend_modules/environment');
var jwt = require('jsonwebtoken');

var parsetoUser = function (request){
    var user = new User(request.body);
    return (!user.username) ? parsetoUser2(request) : user;
}

var parsetoUser2 = function (request){
    let user = new User();
    user.username = request.body.username;
    user.password = request.body.password;
    user.isManager = false;
    user.isDisabled = false;
    return user;
}

router.use(function (req, res, next) {
    console.log('===Receive a signup request===');
    next();
})

router.route('/')
    .post(function (req, res) {
        //request sign up
        //use: http://myurl/signup/
        //post body: {}
        let user = parsetoUser(req);
        user.isManager = false;
        user.isDisabled = false;

        signupModule.emailVerify(user,(err)=>{
            if (err){
                res.json({status:'0', message:err});
                console.log(err);
            }else{
                res.json({status:'1', message:'Mail sent'});
                console.log('Mail sent');
            }
        });
    });

router.route('/:verify_url')
    .get(function (req, res) {
        //request to verify email
        //use: http://myurl/post/veriyf_url
        signupModule.emailConfirm(req.params.verify_url,(err)=>{
            if (err){
                res.json({status:'0', message:err});
                console.log(err);
            }else{
                res.send('Email is Verified!');
                console.log('Email Confirmed!');
            }
        })
    });

router.route('/resend')
    .post(function (req, res) {
        //request to resend email
        //use: http://myurl/post/resend
        //post body {email}
        signupModule.emailResend(req.body.email, (err)=>{
            if (err){
                res.json({status:'0', message:err});
                console.log(err);
            }else{
                res.json({status:'1', message:'Email Resent!'});
                console.log('Email Resent!');
            }
        })
    });


module.exports=router;