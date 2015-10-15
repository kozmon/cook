var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware')
var multer  = require('multer');
var easyimg = require('easyimage');

// db
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('127.0.0.1:27017/cook');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(
    sassMiddleware({
        src: path.join(__dirname, 'public'),
        dest: path.join(__dirname, 'public'),
        debug: true,
        outputStyle: 'compressed',
        prefix: '/prefix'
    })
);

var upload = multer({
    dest: './public/uploads/'
});

app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./routes/index')(app, db, upload, easyimg);
require('./routes/ingredient')(app, db, upload, easyimg);
require('./routes/resource')(app, db, upload, easyimg);
require('./routes/process')(app, db, upload, easyimg);
require('./routes/kitchen')(app, db, upload, easyimg);

app.use(function(req,res,next){
    req.db = db;
    next();
});

//app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
/*
var done = false;

app.post('/api/photo', function(req,res){
    if (done==true) {
        console.log(req.files);
        res.end("File uploaded.");
    }
});
*/
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
