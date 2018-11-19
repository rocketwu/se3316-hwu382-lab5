var ENV = require('./environment');

var User = require('../models/userModel'),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken');

function login (user, cb){
    User.findOne({username: user.username}, function (err, theUser) {
        if (err){
            //error happen
            cb(err, null);
        }
        if (theUser){
            //user is found, check password
            bcrypt.compare(user.password, theUser.password, function (err, res) {
                if (err){
                    cb(err, null);
                }
                if (res){
                    //the password is right
                    if (theUser.isDisabled){
                        cb("Disabled", null);
                        return;
                    }
                    jwt.sign({UserID: theUser._id}, ENV.secretKey, {expiresIn: ENV.tokenExpire}, function (err, token) {
                        if (err){
                            cb(err,null);
                        }
                        if (token){
                            cb(null, token);
                        }
                    });

                } else{
                    //the password is wrong
                    cb("wrong password", null);
                }
            });
        }
    })
}

function verifyLoginToken(req, res, next){
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    }else{
        res.json({
            status:'0',
            message:'Missing token'
        })
    }
}

exports.login=login;
exports.verifyLoginToken=verifyLoginToken;