var fs = require('fs');
var ENV = require('./backend_modules/environment');
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
mongoose.connect(ENV.mongodbURL);

var router = express.Router();

//register routers
var signupRouter = require('./routes/signup'),
    loginRouter = require('./routes/login'),
    itemRouter = require('./routes/item'),
    commentRouter = require('./routes/comment'),
    cartRouter = require('./routes/cart'),
    listRouter = require('./routes/list'),
    userRouter = require('./routes/user'),
    policyRouter = require('./routes/policy'),
    testRouter = require('./routes/test');

//settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function (request, response, next) {
    response.setHeader('Access-Control-Allow-Origin',
        'http://localhost:4200');
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-Type, Accept, Authorization");
    response.header('Access-Control-Allow-Methods', 'POST, PATCH,GET, PUT, DELETE, OPTIONS');
    next();
});


router.get('/',(req,res)=>{
    res.json({message:"Backend server at your service!"});
});


//use router
app.use('/',router);
app.use('/signup',signupRouter);
app.use('/login',loginRouter);
app.use('/item',itemRouter);
app.use('/comment',commentRouter);
app.use('/cart', cartRouter);
app.use('/list', listRouter);
app.use('/user', userRouter);
app.use('/policy', policyRouter);
app.use('/test',testRouter);



app.listen(ENV.port);
console.log('Backend Server Up, Port: '+ENV.port);