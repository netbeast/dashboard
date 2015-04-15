var path = require('path');
var fs = require('fs-extra');
var config = require('./config');

Helper = {};

// Returns array of app names
Helper.getApps = function () {
  return fs.readdirSync(config.appsDir);
}

// Returns array of
// [{name: <appName>, logo: <appLogo>},...]
//
Helper.getAppsJSON = function () {
  var data = [];
  var pkgJson;

  fs.readdirSync(config.appsDir).forEach(function(file) {
    PATH = path.join(config.appsDir, file, 'package.json');
    if (fs.existsSync(PATH)) {
      pkgJson = fs.readJsonSync(PATH);
      data.push({
        name: pkgJson.name, 
        logo: (pkgJson.logo !== undefined)
          ? pkgJson.logo.split('/').pop()
          : undefined
      });
    }
  });
  return data;
}

Helper.getAppPkgJSON = function (app) {
  var pkgJson = undefined;

  fs.readdirSync(config.appsDir).forEach(function(file) {
    if(file === app) {
      PATH = path.join(config.appsDir, file, 'package.json');
      if (fs.existsSync(PATH)) {
        pkgJson = fs.readJsonSync(PATH);
        pkgJson.logo = (pkgJson.logo !== undefined)
          ? pkgJson.logo.split('/').pop()
          : undefined;
      }
    }
  });

  return pkgJson;
}

Helper.deleteApp = function (app, callback) {
  fs.readdirSync(config.appsDir).forEach(function(root) {
    if(root === app) {
      PATH = path.join(config.appsDir, root);
      if (fs.existsSync(PATH)) {
        fs.remove(PATH, function(removeError) {
          if (removeError) {
            console.log(removeError);
          } else {
            console.log("Dir \"%s\" was removed", PATH);
          }
          callback.call(this, removeError);
        });
      }
    }
  });
}

module.exports = Helper;