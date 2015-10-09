# [OWASP](https://www.owasp.org) Threat Dragon #

An online threat modelling web application including system diagramming and a rule engine to auto-generate threats/mitigations. 
The focus will be on great UX, a powerful rule engine and integration with other development lifecycle tools.

We are currently maintaining [a working protoype](http://babydragon.azurewebsites.net/#/) in sych with the main code branch.

An [OWASP Incubator Project](https://www.owasp.org/index.php/OWASP_Threat_Dragon).

**Project leader:** Mike Goodwin (mike.goodwin@owasp.org)

##Getting started

ThreatDragon is a Single Page Application (SPA) using Angular on the client and node.js on the server, althought the server side code does almost nothing so far.
To build and run locally, follow these steps:

Install Git and node.js. Threat Dragon uses Grunt for its build workflow, so

`npm install -g grunt-cli`

To get the code, go to where you want your code to be located and do

`git init`

`git clone https://bitbucket.org/theblacklabrador/threatmodellingtool.git`

This installs code in two sub-folders. One for the main application (`td`) and one for the unit tests (`threatdragon.tests`). In the `td` folder get all the node
packages:

`npm install`

All the build workflow task are in the default grunt task, so just do

`grunt`

and then start the node web serverdie td


`node bin\www`

If you then browse to `http://localhost:3000` you should see the running application.

##Running the unit tests

The unit tests are written using Jasmine and can be run with Karma using a Grunt task. Install recent versions of Chrome, Firefox and IE. To install all packages for the unit tests go to the `threatdragon.tests` folder and do

`npm install`

then run the tests using

`grunt`

Note: If you are on Windows and are having problems installing Karma, the simplest way to resolve this seems to be to install Python v2.7.x (not v3+) and then install Visual Studio Express as per the SO answer suggested in [this link](http://codedmi.com/questions/298619/npm-install-g-karma-error-msb4019-the-imported-project-c-microsoft-cpp-defau). This sounds mad, but the alternative is a world of pain installing various patches and components one by one. At least it's free :o/

More documentation will follow soon...