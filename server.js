var debug = require('debug')('OWASP Threat Dragon');
var app = require('./td.server/app');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});
