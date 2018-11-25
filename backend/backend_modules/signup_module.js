var ENV = require('./environment');

var User = require('../models/userModel'),
    mongoose = require('mongoose'),
    nev = require('./email_verify')(mongoose),
    bcrypt = require('bcrypt');

var myHasher = function(password, tempUserData, insertTempUser, callback) {
    bcrypt.hash(password, ENV.saltRound, function (err, hash) {
        return insertTempUser(hash, tempUserData, callback);
    });
};

nev.configure({
    verificationURL: ENV.host+':'+ENV.port+'/signup/${URL}',
    persistentUserModel: User,
    tempUserCollection: 'tempusers',
    emailFieldName: 'username',

    transportOptions: {
        service: 'Gmail',
        auth:{
            user: 'hwu382@gmail.com',
            pass: 'hvkopclothjpclca'
        }
    },
    verifyMailOptions: {
        from: `Do Not Reply <hwu382@gmail.com>`,
        subject: 'Please confirm account',
        html: 'Click the following link to confirm your account:</p><p>${URL}</p>',
        text: 'Please confirm your account by clicking the following link: ${URL}'
    },
    confirmMailOptions: {
        from: `Do Not Reply <hwu382@gmail.com>`,
        subject: 'Successfully verified!',
        html: '<p>Your account has been successfully verified.</p>',
        text: 'Your account has been successfully verified.'
    },
    hashingFunction: myHasher,
},function(error,options){});

nev.generateTempUserModel(User, function (err, tempUserModel) {
    console.log(err);
});

function emailVerify(user,cb){


    // var email=user.username,
    //     password=user.password;
    if(typeof user.username =="undefined")
    {
        cb("invalid username");
        return;
    }
    console.log(user.username+" try to sign up");

    nev.createTempUser(user, function (err, existingPersistentUser, newTempUser) {
        if (err){
            //console.log(err);
            cb(err);
            return;
        }
        if (existingPersistentUser){
            //console.log("email exist!");
            cb('email exist!');
            return;
        }
        if (newTempUser){
            var URL =newTempUser[nev.options.URLFieldName];
            nev.sendVerificationEmail(user.username,URL,function (err, info) {
                if (err){
                    // console.log(err);
                    // throw  err;
                    cb(err)
                    return;
                }
                //success send the email
                // console.log("mail send!");
                // return true;
                cb(null);
            })
        } else {
            // console.log(err);
            // throw  err;
            cb('Email verification in process, Want to resend verification Email?');
        }
    });
}

function emailConfirm(url, cb){
    nev.confirmTempUser(url, function(err, user) {
        if (err){
            // console.log(err);
            // throw err;
            cb(err);
        }

        // user was found!
        if (user) {
            // optional
            nev.sendConfirmationEmail(user['username'], function(err, info) {
                if (err){
                    // console.log(err);
                    // throw  err;
                    cb(err);
                }
                //success send the email
                // console.log("mail send!");
                // return true;
                cb(null);
            });
        }

        // user's data probably expired...
        else{
            // console.log('may need resend');
            cb('may need resend!')
        }

    });
}

function resendEmail(email, cb){
    nev.resendVerificationEmail(email,function (err, userFound) {
        if(err){
            // console.log(err);
            // throw err;
            cb(err);
        }
        if (userFound){
            // console.log("email has been sent");
            // return true;
            cb(null);
        }
        else{
            // console.log("cannot resend, user not found");
            // throw Error("Cannot resend");
            cb('Cannot resend!');
        }

    })
}
exports.emailVerify=emailVerify;
exports.emailConfirm=emailConfirm;
exports.emailResend=resendEmail;
