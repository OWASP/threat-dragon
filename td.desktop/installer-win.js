var electronInstaller = require('electron-winstaller');
var path = require('path');
var readline = require('readline');
const rootPath = path.join('./');

var options = {
  appDirectory: './build/OWASP-Threat-Dragon-win32-x64',
  outputDirectory: './installers/win32-x64',
  authors: 'OWASP',
  exe: 'OWASP-Threat-Dragon.exe',
  noMsi: true,
  loadingGif: './public/content/icons/png/cupcakes-installing.gif',
  iconUrl: 'https://raw.githubusercontent.com/owasp/threat-dragon/main/td.desktop/public/content/icons/win/td.ico',
  setupIcon: path.join(rootPath, 'content', 'icons', 'win', 'td.ico'),
  description: 'An open source threat modelling tool from OWASP',
  remoteReleases: "https://github.com/OWASP/threat-dragon"
};

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Relative path to code signing certificate file (<return> for no signing): ', function(path) {

    if (path) {
      
      rl.question('Password for code signing certificate file (<return> for no signing): ', function(password) {
        
        if (password) {
          options.certificateFile = path;
          options.certificatePassword = password;
        }

        rl.close();
  
      });
    }
    
    var resultPromise = electronInstaller.createWindowsInstaller(options);
    resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));
});
