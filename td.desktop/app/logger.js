
exports.init = function (level) {

  const log = require('electron-log');

  //if already set up then return the instance
  if (level == null) {
    return log;
  }

  //set the log level to one of error, warn, info, verbose, debug, silly
  if (level == 0) {
    log.transports.console.level = 'error';
  } else if (level == 1) {
    log.transports.console.level = 'info';
  } else if (level == 2) {
    log.transports.console.level = 'debug';
  } else {
    log.transports.console.level = 'silly';
  }
  log.transports.file.level = log.transports.console.level;

  return log;
};

