var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
const { Pool } = require('pg');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require("dotenv").config();

var indexRouter = require('./routes/index');
var urlRouter = require('./routes/url');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/r', indexRouter);
app.use('/url', urlRouter);

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

const pool = new Pool({
  user: process.env.DB_user,
  host: process.env.DB_host,
  database: process.env.DB_database,
  password: process.env.DB_password,
  port: process.env.DB_port
})

fs.readFile(__dirname+"/script.sql", 'utf8', function(err, data) {
  if (err) throw err;
  pool.connect((err, client, done) => {
      if (err) throw err
      var query = data.trim();
      client.query(query, (err, res) => {
          done()
          if (err) throw err
      })
  })
});


module.exports = app;
