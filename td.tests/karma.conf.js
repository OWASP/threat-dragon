// Karma configuration
// Generated on Thu Jun 18 2015 22:02:08 GMT+0100 (GMT Daylight Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        '../td/public/libs/angular/angular.js',
        '../td/public/libs/angular-route/angular-route.js',
        '../td/public/libs/nools/nools.js',
        '../td/public/libs/jquery/jquery.js',
        '../td/public/libs/bootstrap/bootstrap.js',
        '../td/public/libs/toastr/toastr.js',
        '../td/public/libs/lodash/lodash.js',
        '../td/public/libs/backbone/backbone.js',
        '../td/public/libs/joint/joint.js',
        '../td/public/libs/angular-ui-bootstrap-bower/ui-bootstrap-tpls.js',
        '../td/public/libs/angular-mocks/angular-mocks.js',
        '../td/public/app/*.js',
        '../td/public/app/**/*.js',
        'spec/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 5858,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'Firefox'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};

