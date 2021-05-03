var appFactory = require('./dist/app.js');


var app = appFactory.create();

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});
