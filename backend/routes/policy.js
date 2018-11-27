var express = require('express');
var router = express.Router();
var fs = require('fs');

var loginModule = require('../backend_modules/login_module');

router.use(function (req, res, next) {
    console.log('===Receive a request about policy===');
    next();
});

router.route('/').get((req,res)=>{
    fs.readFile('policy.txt', function (err, data) {
        if (err) {
            res.statusCode(404);
        }
        else {
            res.json({status: 1, content: data.toString()});
        }
    });
})
    
.put(loginModule.verifyLoginToken, function (req, res) {
    loginModule.verifyAuthority(req, res, true, function (user) {
        fs.writeFile('policy.txt', req.body.content, function (err) {
            if (err){
                res.json({status: '0'});
            } else {
                res.json({status: '1'});
            }
        })
    })
});


module.exports=router;