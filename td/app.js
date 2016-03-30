var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var passport = require('passport');
var requestLogger = require('morgan');
var bunyan = require('bunyan');
var app = express();

//static content
app.use('/public', express.static(path.join(__dirname, 'public')));

//security headers
require('./config/securityheaders.config')(app);

//sessions
require('./config/session.config')(app);

//passport
require('./config/passport.config')(app);

//favicon
app.use(favicon(__dirname + '/public/favicon.ico'));

//routes
require('./config/routes.config')(app);

//logging
app.use(requestLogger('dev'));
var log = bunyan.createLogger({name: 'threatdragon'});
log.info('hi');
log.warn({lang: 'fr'}, 'au revoir');

//parsers
require('./config/parsers.config')(app);

//// catch 404 and forward to error handler
//app.use(function (req, res, next) {
//    var err = new Error('Not Found');
//    err.status = 404;
//    next(err);
//});

//// error handlers

//// development error handler
//// will print stacktrace
//if (app.get('env') === 'development') {
//    app.use(function (err, req, res, next) {
//        res.status(err.status || 500);
//        res.render('error', {
//            message: err.message,
//            error: err
//        });
//    });
//}

//// production error handler
//// no stacktraces leaked to user
//app.use(function (err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//        message: err.message,
//        error: {}
//    });
//});

module.exports = app;
