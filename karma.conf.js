var cover = require('browserify-istanbul');
var coverOptions = { ignore: ['test/**/*.js'], defaultIgnore: true };

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    //set high to avoid PhantomJS timeout
    //https://github.com/karma-runner/karma-phantomjs-launcher/issues/126
    browserNoActivityTimeout: 120000,

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['phantomjs-shim', 'jasmine', 'browserify'],

    // list of files / patterns to load in the browser
    files: [
        'td/public/app/threatdragon.min.js',
        './node_modules/phantomjs-polyfill-find/find-polyfill.js',
        'td/public/libs/jasmine-jquery/jasmine-jquery.js',
        'td/public/libs/bootstrap/bootstrap.js',
        'td/public/libs/angular-mocks/angular-mocks.js',
        'td/public/app/*.js',
        'td/public/app/**/*.js',
        'td.tests/clientspec/*.js',
        'td/public/app/**/*.html'
    ],


    // list of files to exclude
    exclude: [
        'td/public/app/threatdragon.js', //run tests on minified code
        'td/public/app/config.route.js',
        'td/public/app/config.exceptionHandler.js',  //enables more specific unit tests
        'td/public/app/app.js',
        'td/public/app/common/*.js',
        'td/public/app/config.js',
        'td/public/app/directives.js',
        'td/public/app/services/datacontext.js',
        'td/public/app/services/threatengine.js',
        'td/public/app/services/routemediator.js',
        'td/public/app/services/dialogs.js',
        'td/public/app/services/dialogControllers.js',
        'td/public/app/services/diagramming.js',
        'td/public/app/services/joint.shapes.tm.js',
        'td/public/app/services/index.js',
        'td/public/app/diagrams/index.js',
        'td/public/app/diagrams/diagramdirectives.js',
        'td/public/app/diagrams/elementPropertyDirectives.js',
        'td/public/app/layout/index.js',
        'td/public/app/layout/shell.js',
        'td/public/app/welcome/index.js',
        'td/public/app/welcome/welcome.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        'td/public/app/**/*.js': ['coverage'],
        'td/public/app/**/*.html': ['ng-html2js'],
        'td.tests/clientspec/*.js': ['browserify']
    },

    browserify: {
      debug: true,
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec', 'coverage'],

    //config for coverage reporter
    coverageReporter: {
        reporters: [{ type: 'lcov' }]
    },

    //config for ngHtml2JsPreprocessor
    ngHtml2JsPreprocessor: {
        // strip this from the file path
        stripPrefix: 'td',
        prependPrefix: '.'
    },

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
    browsers: ['Chrome', 'Firefox', 'IE', 'PhantomJS'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};

