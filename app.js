var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/kayttajat');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  resave: true,
  saveUninitialized: true,
  coocieName:'piparkakku',
  secret: "kissanviikset"
}));


// This is Index router, it will handle other URL-calls
app.use('/', indexRouter);


const kayttajat_urls = [
    '/kayttajat',
    '/users'
]
app.use(kayttajat_urls.join('|'), usersRouter);   // Here /fi is optional, hence parenthesis and a questionmark

// Below is the base for a more dynamic approach
/*
app.use('(/:lang(en|fi))?/kayttajat', usersRouter);
app.use('(/:lang(en|fi))?/users', usersRouter);
*/



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
