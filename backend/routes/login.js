var express = require('express');
var router = express.Router();
var User = require('../models/userModel');
var loginModule = require('../backend_modules/login_module');

var parsetoUser = function (request){
    var user = new User(request.body.user);
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
    console.log('===Receive a login request===');
    next();
})

router.route('/')
    .post(function (req, res) {
        //request login
        //use: http://myurl/login/
        //post body: {username, passowrd}
        let user = parsetoUser(req);
        loginModule.login(user, (err, token)=>{
            if (err){
                res.json({status:'0', message:err});
                console.log(err);
            }else{
                res.json({
                    status:'1',
                    message:'Login Success',
                    token: token
                });
                console.log(user.username+" logged in.");
            }
        })

    });


module.exports=router;