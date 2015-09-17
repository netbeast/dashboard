var path = require('path')
var www = require('../../www')
var fs = require('fs-extra')
var config = require('../../config')

Helper = {}

// Returns array of app names
Helper.getApps = function () {
  return fs.readdirSync(config.appsDir)
}

// Returns array of
// [{name: <appName>, logo: <appLogo>},...]
//
Helper.getAppsJSON = function () {
  var data = []
  var pkgJson
  fs.readdirSync(config.appsDir).forEach(function(file) {
    PATH = path.join(config.appsDir, file, 'package.json')
    if (fs.existsSync(PATH)) {
      pkgJson = fs.readJsonSync(PATH)
      data.push({
        name: pkgJson.name
      })
    }
  })
  return data
}

Helper.getAppPkgJSON = function (app) {
  var pkgJson = undefined
  fs.readdirSync(config.appsDir).forEach(function(file) {
    if(file === app) {
      PATH = path.join(config.appsDir, file, 'package.json')
      if (fs.existsSync(PATH)) {
        pkgJson = fs.readJsonSync(PATH)
      }
    }
  })
  return pkgJson
}

Helper.deleteApp = function (app, callback) {
  var PATH = path.join(config.appsDir, app)

  if (!fs.existsSync(PATH)) {
    var err = new Error('App does not exist')
    err.code = 404
    return callback.call(this, err)
  }

  console.log('Uninstalling ' + app)
  www.io.emit('stdout', 'Uninstalling ' + app + '...')
  fs.remove(PATH, function(err) {
    if (err)
      console.log(err)
    else
      www.io.emit('success', app + ' successfully uninstalled')

    return callback.call(this, err)
  })
}

module.exports = Helper