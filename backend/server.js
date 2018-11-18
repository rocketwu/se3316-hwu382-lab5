
var ENV = require('./backend_modules/environment');
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

var mongoose   = require('mongoose');
mongoose.connect(ENV.mongodbURL);

var router = express.Router();


router.get('/',(req,res)=>{
    res.json({message:"Backend server at your service!"});
});

app.use('/',router);

app.listen(ENV.port);
console.log('Backend Server Up, Port: '+ENV.port);