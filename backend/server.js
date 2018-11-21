
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
    testRouter = require('./routes/test');

//settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



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
app.use('/test',testRouter);



app.listen(ENV.port);
console.log('Backend Server Up, Port: '+ENV.port);