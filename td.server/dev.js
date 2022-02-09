var appFactory = require('./src/app.js');

var app = appFactory.default.create();

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});

process.once('SIGUSR2', 
  function () { 
    process.kill(process.pid, 'SIGUSR2'); 
  }
);
