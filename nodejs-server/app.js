var bodyParser = require('body-parser');
var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var path = require('path');

var photosRouter = require('./routes/photos');
var preferencesRouter = require('./routes/preferences');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
const payloadSizeLimit = '50mb';
app.use(bodyParser.json({ limit: payloadSizeLimit }));
app.use(bodyParser.urlencoded({ limit: payloadSizeLimit, extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/photos', photosRouter);
app.use('/preferences', preferencesRouter);

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