var appFactory = require('./dist/app.js');

var app = appFactory.default.create();

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on ' + server.address().address + ':' +  server.address().port);
});
