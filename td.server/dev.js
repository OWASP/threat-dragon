var appFactory = require('./src/app.js');

var app = appFactory.default.create();

var server = app.listen(app.get('port'), function() {
    console.log('Development server listening at ' + server.address().address + ' on port ' +  server.address().port);
});

process.once('SIGUSR2', 
  function () { 
    process.kill(process.pid, 'SIGUSR2'); 
  }
);
