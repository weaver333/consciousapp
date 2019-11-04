require('dotenv').config();

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var sslRedirect = require('heroku-ssl-redirect');

var hbs = require('./core/hbs');
var seed = require('./core/seed');
var routes = require('./core/router');
var constant = require('./core/constant');

// enable ssl redirect
app.use(sslRedirect());

//connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/consciousapp');
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
});

//use sessions for tracking logins
app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// template engine
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', 'app/views');

// serve static files from template
app.use(express.static(__dirname + '/app/public'));

// include routes
app.use('/', routes);


/**
 * define as the last app.use callback
 */

app.use(function (req, res, next) {
    if (req.filePath) {
        if (req.user) req.data.user = req.user;
        return res.render(req.filePath, req.data);
    }
    next({ status: 404, message: 'Not Found' });
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render(`${err.status || 500}`, {
        'message': err.message
    });
});

app.locals.stripePubKey = constant.stripeOptions.stripePubKey;

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
    console.log('Express app listening on port', process.env.PORT || 3000);
});