var express = require('express');
var router = express.Router();
var loginModule = require('../backend_modules/login_module');

var Dcma = require('../models/dcmaModel');

router.use(function (req, res, next) {
    console.log('===Receive a request about DCMA===');
    next()

});

router.route('/')
    .post(function (req, res) {
        //request add dcma request
        //use: POST http://myurl/dcma/
        //post body: {issuer, content, contact}
        let dcma = new Dcma(req.body);
        dcma.done = false;
        dcma.save(function (err) {
            if (err){
                res.json(err);
            } else{
                res.json({status: '1', message: 'Your request has been submitted'});
            }
        })
    })

    .get(loginModule.verifyLoginToken, function (req, res) {
        //request to get all dcma request
        //use: GET .../dcma/
        loginModule.verifyAuthority(req, res, true, function (user) {
            Dcma.find(function (err, dcmas) {
                if (err) res.json({status: '0', message: err});
                else{
                    res.json(dcmas);
                }
            })
        })
    });
//
router.route('/:dcma_id')
    .put(loginModule.verifyLoginToken, function (req, res) {
        //request update item
        //use: PUT http://myurl/dcma/<dcma_id>
        //put body: {done}
        //only store manager can do
        loginModule.verifyAuthority(req ,res, true, function () {
            Dcma.findById(req.params.dcma_id, function (err, dcma) {
                if(err){
                    res.json({status: '0',message:err});
                }else{
                    dcma.done = req.body.done;
                    dcma.save(function (err) {
                        if (err) {
                            res.json({status: '0', message: err});
                        } else {
                            res.json({status: '1', message: 'dcma status updated!'});
                        }
                    })
                }
            })
        })
    });

module.exports=router;