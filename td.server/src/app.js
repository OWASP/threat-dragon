var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bunyan = require('bunyan');

var upDir = '..' + path.sep;
var siteDir = path.join(__dirname, upDir, upDir, 'dist');

try {
    var app = express();
    app.set('trust proxy', true);
    app.set('views', path.join(siteDir, 'views'));
    app.set('view engine', 'pug');

    // environment configuration
    require('./config/env.config').tryLoadDotEnv();

    //static content
    app.use('/public', express.static(siteDir));

    //security headers
    require('./config/securityheaders.config')(app);

    //sessions
    require('./config/session.config')(app);

    //passport
    require('./config/passport.config')(app);

    //favicon
    app.use(favicon(path.join(siteDir, 'favicon.ico')));

    //logging
    require('./config/loggers.config').config(app);

    //parsers
    require('./config/parsers.config')(app);

    //routes
    require('./config/routes.config')(app);

    bunyan.createLogger({ name: 'threatdragon', level: 'info' }).info('owasp threat dragon application started up');  
}
catch (e) {
    var errorLogger = bunyan.createLogger({ name: 'threatdragon' });
    errorLogger.error('owasp threat dragon failed to start up');
    errorLogger.error(e.message);
}

module.exports = app;
