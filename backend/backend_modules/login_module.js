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
                    cb(err, null, null);
                }
                if (res){
                    //the password is right
                    if (theUser.isDisabled){
                        cb("Disabled", null, null);
                        return;
                    }
                    jwt.sign({UserID: theUser._id}, ENV.secretKey, {expiresIn: ENV.tokenExpire}, function (err, token) {
                        if (err){
                            cb(err,null ,null);
                        }
                        if (token){
                            cb(null, token, theUser);
                        }
                    });

                } else{
                    //the password is wrong
                    cb("wrong password", null, null);
                }
            });
        } else {
            cb("No such Username", null, null);
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

function verifyAuthority(req, res, isManager, passVerification){
    //use to check the authority of a user. isManager is used to check whether a manager is required
    //if the user pass the check, passVerification will be execute.
    //passVerification has a parameter which standard for the user find in database
    jwt.verify(req.token, ENV.secretKey, (err, payload) => {
        if (err) {
            res.json({status: '0', message: 'Login status expired'});
        } else {
            //use the user id in payload to check the user is valid or not
            let userID = payload.UserID;
            User.findById(userID, function (err, user) {
                if (err || user.isDisabled) {
                    res.json({status: '0', message: 'Login status expired'});
                    return;
                }
                if (user) {
                    if (isManager){
                        //check is manager
                        if(user.isManager){
                            //user is a manager
                            passVerification(user);
                        }else {
                            res.json({status: '0', message: 'permission deny, need manager account'});
                        }
                    }else{
                        //normal user can do
                        passVerification(user);
                    }
                } else {
                    res.json({status: '0', message: 'Login status expired'});
                }
            })
        }
    });
}

exports.login=login;
exports.verifyLoginToken=verifyLoginToken;
exports.verifyAuthority=verifyAuthority;