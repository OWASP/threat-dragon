var Jasmine = require('jasmine');
var SpecReporter = require('jasmine-spec-reporter');
var noop = function() {};

//istanbul --include-all-sources tries to instument node-modules,bower-packages etc.
//see https://github.com/gotwarlost/istanbul/issues/142
//therefore explicitly require files for now...

// this errors because connect-azuretables needs a connection string
// var glob = require('glob');
// glob.sync('./td/**/*.js', {ignore: ['./td/public/**/*.js']}).forEach(function(file) {require('../../../' + file)});

var jrunner = new Jasmine();
jrunner.configureDefaultReporter({print: noop});    // remove default reporter logs
jasmine.getEnv().addReporter(new SpecReporter());   // add jasmine-spec-reporter
jrunner.loadConfigFile('./td.tests/serverspec/support/jasmine.json'); // load jasmine.json configuration
jrunner.execute();