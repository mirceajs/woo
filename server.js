const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
// create express app
const app = express();
const path = require('path');
//allow cross origin requests
app.use(function(req, res, next) { 
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use('/', express.static(path.join(__dirname, 'public'), { redirect: false }));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});
var upload = multer({ //multer settings
                storage: storage
            }).single('file');
/** API path that will upload the files */
app.post('/upload', function(req, res) {
    upload(req,res,function(err){
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
        if (req.file) {
            res.json({error_code:0,filename:req.file.filename});
        }
        else {
            res.json({error_code:1,err_desc:new Error('Empty file')});
        }
         
    })
});

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
/*
For Mac/Linux users, you can simply type:

export MONGOLAB_URI="mongodb://username:password@ds01316.mlab.com:1316/food"

For Windows users:

SET MONGOLAB_URI=mongodb://username:password@ds01316.mlab.com:1316/food

After setting the Environment variables you need to call the Environment Variable into your code. You can do it by typing this

var url = process.env.MONGOLAB_URI;
*/
//mongoose.connect(dbConfig.url)
console.log('Connecting to '+process.env.MONGODB_URI)
// mongoose.connect(process.env.MONGODB_URI)
mongoose.connect(dbConfig.url)
.then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to RESTful Web service for Woo."});
});

// Require Admin, Category, Card routes
require('./app/routes/admin.routes.js')(app);
require('./app/routes/category.routes.js')(app);
require('./app/routes/card.routes.js')(app);
require('./app/routes/user.routes.js')(app);
require('./app/routes/experienceCard.routes.js')(app);

// listen for requests
app.listen(process.env.PORT || 3300, () => {
    var port = process.env.PORT || 3300;
    console.log("Server is listening on port "+port);
});
module.exports = app