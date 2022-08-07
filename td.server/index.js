var appFactory = require('./dist/app.js');

var app = appFactory.default.create();

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening at ' + server.address().address + ' on port ' +  server.address().port);
});
