var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/trektrivia');

//----------Database Configuration-----------------

var databaseUri = 'mongodb://localhost/trektrivia'
//-----------------------------------------------------

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(databaseUri);
}

//-------End of Database Configuration----------------------------------------------

var db = mongoose.connection;

//show any mongoose errors
db.on('error', function(err) {
  console.log('Mongoose Error:', err);
});

//once logged in to the db
db.once('open', function() {
  console.log('Mongoose connection successful!');
});

//----------------------------------------------------------

var routes = require('./routes/index');
var users = require('./routes/users');

// Init App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


//

//===============ROUTES=================


//displays the practice game page
app.get('/nxclass', function(req, res){
  res.render('nxclass');
});

//displays the easy game page
app.get('/constitution', function(req, res){
  res.render('constitution');
});

//displays the medium game page
app.get('/galaxy', function(req, res){
  res.render('galaxy');
});

//displays the hard game page
app.get('/intrepid', function(req, res){
  res.render('intrepid');
});

//displays the very hard game page
app.get('/sovereign', function(req, res){
  res.render('sovereign');
});

//displays the game over page if the timer goes to 0
app.get('/gameover', function(req, res){
  res.render('gameover');
});

//=========================================

app.use('/', routes);
app.use('/users', users);

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
  console.log('Server started on port '+app.get('port'));
});