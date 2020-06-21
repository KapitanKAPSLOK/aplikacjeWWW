"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var router = require('./routes');
var session = require('express-session');
var SQLiteStore = require('connect-sqlite3')(session);
// db.run('SELECT * FROM sessions',[],w=>{
//     console.log(w);
// })
// SQLiteStore.get('s%3Achm2iwucwqsnSd118uV79DycsYM0WwPu.Sz2JG4F7GuvkjVSqBx8vGv%2F0a9KTnliKiA14yTNc9ZU',w=>{
//     console.log(w);
// })
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    store: new SQLiteStore,
    resave: false,
    saveUninitialized: true,
    secret: 'fad8912ma0dfoakSKJD1jadjjJa!jif',
    cookie: {}
}));
app.use('/', router);
app.use(express.static(path.join(__dirname, 'public')));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;
