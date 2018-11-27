var express = require('express');
var router = express.Router();
var loginModule = require('../backend_modules/login_module');

var Comment = require('../models/commentModel');
var Item = require('../models/itemModel');

var parsetoComment = function (request){
    var comment = new Comment(request.body);
    return (!comment.itemID) ? parsetoComment2(request) : comment;
}

var parsetoComment2 = function (request){
    let comment = new Comment();
    comment.authorID = request.body.authorID;
    comment.itemID = request.body.itemID;
    comment.content = request.body.content;
    comment.rank = request.body.rank;
    comment.isVisible = request.body.isVisible;
    comment.author = request.body.author;
    return comment;
}

router.use('/:item_id', function (req, res, next) {
    console.log('===Receive a request about comment===');

    if (req.originalUrl.split("/")[2]=='hide') next();  //add exception for /hide/<comment_id>
    else{
        Item.findById(req.params.item_id, function (err, item) {
            if (item) next();
            else res.json({status: '0', message: 'Item not found'});
        });
    }

});

router.route('/:item_id')
    .post(loginModule.verifyLoginToken, function (req, res) {
        //request add item comment
        //use: POST http://myurl/comment/<item_id>
        //post body: {content, rank, author}
        //only login user can do
        loginModule.verifyAuthority(req, res, false, function (user) {
            let comment = parsetoComment(req);
            if (comment.rank && comment.author){
                comment.authorID = user._id;
                comment.itemID = req.params.item_id;
                comment.isVisible = true;
                comment.save(function (err) {
                    if (err){
                        res.json(err);
                    } else{
                        res.json({status: '1', message: 'success add comment'});
                    }
                });
            }else{
                res.json({status: '0', message: 'invalid comment, please add rank and author'});
            }
        })
    })

    .get(function (req, res) {
        //request to get comments of an item
        //use: GET http://myurl/comment/<item_id>
        Comment.find({itemID: req.params.item_id}, function (err, comments) {
            //request to get all comments related to item
            //use: GET http://myurl/comment/<item_id>
            if (err) res.json({status: '0', message: err});
            else{
                res.json(comments);
            }
        })
    });
//
router.route('/hide/:comment_id')
    .put(loginModule.verifyLoginToken, function (req, res) {
        //request update item
        //use: PUT http://myurl/comment/hide/<comment_id>
        //put body: {isVisible}
        //only store manager can do
        loginModule.verifyAuthority(req ,res, true, function () {
            Comment.findById(req.params.comment_id, function (err, originComment) {
                if(err){
                    res.json({status: '0',message:err});
                }else{
                    originComment.isVisible = req.body.isVisible;
                    originComment.save(function (err) {
                        if (err) {
                            res.json({status: '0', message: err});
                        } else {
                            res.json({status: '1', message: 'comment status updated!'});
                        }
                    })
                }
            })
        })
    });

module.exports=router;