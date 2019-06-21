module.exports = function (config) {
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
            'td/public/app/app.js',
            'td.tests/clientspec/*.js',
            'td/public/app/**/*.html'
        ],

        // list of files to exclude
        exclude: [
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'td/public/app/**/*.html': ['ng-html2js'],
            'td/public/app/app.js': ['browserify'],
            'td.tests/clientspec/test.js': ['browserify']
        },

        browserify: {
            transform: [
                require("browserify-istanbul")
            ],
            debug: true
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['spec', 'coverage', 'threshold'],

        //config for coverage reporter
        coverageReporter: {
            reporters: [{ type: 'lcov' }]
        },

        //config for threashhold reporter
        thresholdReporter: {
            statements: 90,
            branches: 90,
            functions: 90,
            lines: 90
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

