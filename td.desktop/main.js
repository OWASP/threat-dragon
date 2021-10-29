'use strict';
  
const path = require('path');
const electron = require('electron');
const app = electron.app;
const btoa = require('btoa-lite');
const setupEvents = require('./config/squirrel');
if (setupEvents.handleSquirrelEvent(app)) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
        return;
}

// use yargs to provide a command line interface
// can call it using './electron . --help' after 'ln -sf node_modules/electron/cli.js electron'
var command;
const argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command({
    command: 'edit <json>',
    aliases: ['e'],
    desc: 'Edit JSON threat model',
    handler: (argv) => {
      command = 'edit';
    }
  })
  .command({
    command: 'open <json>',
    aliases: ['o'],
    desc: 'Open JSON threat model',
    handler: (argv) => {
      command = 'open';
    }
  })
  .command({
    command: 'pdf <json>',
    aliases: ['p'],
    desc: 'Export JSON threat model as PDF',
    handler: (argv) => {
      command = 'pdf';
    }
  })
  .command({
    command: 'print <json>',
    aliases: ['p'],
    desc: 'Print JSON threat model',
    handler: (argv) => {
      command = 'print';
    }
  })
  .command({
    command: 'run',
    aliases: ['r', 'x'],
    desc: 'Run threat dragon application',
    handler: (argv) => {
      command = 'run';
    }
  })
  .demandCommand(0, 0, '', 'Command not recognised')
  .options({
    'verbose': {
      alias: 'v',
      describe: 'Increasing levels of verbosity',
      type: 'boolean'
    }
  })
  .count('verbose')
  .help()
  .wrap(80)
  .argv;

// prevent window being garbage collected
let mainWindow;

var windowIsClosed = false;

// set the log level to one of error, warn, info, verbose, debug, silly
const log = require('./app/logger').init(argv.verbose);

// some global values for the app
global.params = {
  command: command,
  logger: log,
  logLevel: argv.verbose,
  modelFile: argv.json,
  url: '/'
}

//Used to communicate with the ipcRenderer on threat-dragon-core to watch for unsaved changes
var ipc = require('electron').ipcMain;
var diagramIsDirty = false;
ipc.on('vmIsDirty', function(event, data){
  diagramIsDirty = data;
});

function isCliCommand() {
  return (command != null);
}

function doCommand() {

  var win = null;
  var encFile;

  log.debug('CLI command', global.params.command, 'with', process.argv.length, 'arguments');

  if (global.params.modelFile != null) {
    encFile = btoa(global.params.modelFile);
  }

  if (command == 'edit') {
    log.verbose('Edit model:', global.params.modelFile);
    global.params.url = '/threatmodel/edit/' + encFile;
    win = createMainWindow();

  } else if (command == 'open') {
    log.verbose('Open model:', global.params.modelFile);
    win = createMainWindow();
    global.params.url = '/threatmodel/' + encFile;

  } else if (command == 'pdf') {
    log.verbose('Export to PDF report and close', global.params.modelFile);
    win = createMainWindow(false, 0, 0);
    global.params.url = '/threatmodel/export/' + encFile;

  } else if (command == 'print') {
    log.verbose('Print model:', global.params.modelFile);
    win = createMainWindow();
    global.params.url = '/threatmodel/report/' + encFile;

  } else if (command == 'run') {
    log.verbose('Run threat dragon application');
    win = createMainWindow();
    global.params.url = '/welcome';

  } else {
    log.error('Unrecognised command', command);
  }

  return win;
}

function winClosed() {
  // dereference the window
  mainWindow = null;
}

function winIsClosing(e) {
  //To avoid showing the dialog box twice
  if (!windowIsClosed && diagramIsDirty) {
    var choice = electron.dialog.showMessageBoxSync(null,
      {
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'Confirm',
        message: 'You have unsaved changes. Are you sure you want to quit?'
      });

    if (choice == 1) {
      log.silly('cancel quitting app');
      e.preventDefault();
    } else {
      windowIsClosed = true;
      log.silly('quitting app');
    }
  }
}

function createMainWindow(show = true, displayWidth = -1, displayHeight = -1) {

  const modalPath = path.join('file://', __dirname, './index.html');
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;

  if (displayWidth < 0) {
    displayWidth = width - 50;
  }

  if (displayHeight < 0) {
    displayHeight = height - 50;
  }

  var win = new electron.BrowserWindow({
    title: "OWASP Threat Dragon",
    icon: path.join(__dirname, 'public/content/icons/png/64x64.png'),
    show: show,
    width: displayWidth,
    height: displayHeight,
    webPreferences: {
      nodeIntegration: true
    }
  });

  log.info('Calling Threat Dragon from command line');

  win.loadURL(modalPath);
  win.webContents.on('new-window', function (e, url) {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  });

  //Workaround: The before-quit seems to be called after quitting when used on Windows and Linux from the cmd line.
  //An additional event 'close' is put on win to fix that
  win.on('close', winIsClosing);

  win.on('closed', winClosed);

  return win;
}

app.on('before-quit', (e) => {
  winIsClosing(e);
});

app.on('window-all-closed', () => {
  log.silly('windows all closed');
  app.quit();
});

app.on('activate', () => {
  log.debug('main window app activate');
  if (!mainWindow && !isCliCommand()) {
    mainWindow = createMainWindow();
  }
});

app.on('ready', () => {
  log.debug('main window app ready');

  if (!isCliCommand()) {
    mainWindow = createMainWindow();
  } else {
    mainWindow = doCommand();
  }

  if (mainWindow == null) {
    log.warn('no main window to show');
    app.quit();
  }

  mainWindow.once('ready-to-show', () => {
    log.silly('main window ready to show');
    if (!isCliCommand()) {
      mainWindow.show();
      mainWindow.maximize();
    }
  });

});
