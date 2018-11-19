
var ENV = require('./backend_modules/environment');
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
mongoose.connect(ENV.mongodbURL);

var router = express.Router();

//register routers
var signupRouter = require('./routes/signup'),
    loginRouter = require('./routes/login')

//settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



router.get('/',(req,res)=>{
    res.json({message:"Backend server at your service!"});
});

//set up expressJwt




app.use('/',router);
app.use('/signup',signupRouter);
app.use('/login',loginRouter);



app.listen(ENV.port);
console.log('Backend Server Up, Port: '+ENV.port);