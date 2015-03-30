var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');

Helper = {};

Helper.DIR = path.join(__dirname, '..', 'sandbox');
// Alias:
Helper.SANDBOX = path.join(__dirname, '..', 'sandbox');
Helper.TMP = path.join(__dirname, '..', 'tmp');
Helper.PUBLIC = path.join(__dirname, '..', 'public');

// Returns array of app names
Helper.getApps = function () {
  return fs.readdirSync(Helper.DIR);
}

// Returns array of
// [{name: <appName>, logo: <appLogo>},...]
//
Helper.getAppsJSON = function () {
  var data = [];
  var packageJSON;

  fs.readdirSync(Helper.DIR).forEach(function(file) {
    PATH = path.join(Helper.DIR, file, 'package.json');
    if (fs.existsSync(PATH)) {
      packageJSON = JSON.parse(fs.readFileSync(PATH, 'utf8'));
      data.push({name: packageJSON.name, logo: packageJSON.logo});
    }
  });
  return data;
}

Helper.getAppPkgJSON = function (app) {
  var packageJSON = undefined;

  fs.readdirSync(Helper.DIR).forEach(function(file) {
    if(file === app) {
      PATH = path.join(Helper.DIR, file, 'package.json');
      if (fs.existsSync(PATH)) {
        packageJSON = JSON.parse(fs.readFileSync(PATH, 'utf8'));
      }
    }
  });

  return packageJSON;
}

Helper.deleteApp = function (app, successCB, errorCB) {
  fs.readdirSync(Helper.DIR).forEach(function(root) {
    if(root === app) {
      PATH = path.join(Helper.DIR, root);
      if (fs.existsSync(PATH)) {
        rimraf(PATH, function(rimrafError) {
          if (rimrafError) {
            console.log(rimrafError);
            if(errorCB) errorCB();
          } else {
            if(successCB) successCB();
          }
        });
      }
    }
  });
}

module.exports = Helper;
