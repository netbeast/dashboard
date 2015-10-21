var path = require('path')
var broker = require('../helpers/broker')
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
Helper.getApps = function (callback) {
  fs.readdir(config.appsDir, callback)
}

Helper.deleteApp = function (app, callback) {
  const PATH = path.join(__dirname, config.appsDir, app)
  console.log(PATH)

  if (!fs.existsSync(PATH)) {
    var err = new Error('App does not exist')
    err.code = 404
    return callback.call(this, err)
  }

  console.log('Uninstalling ' + app)
  broker.emit('stdout', 'Uninstalling ' + app + '...')
  fs.remove(PATH, function(err) {
    if (err)
      console.log(err)
    else
      broker.emit('success', app + ' successfully uninstalled')

    return callback.call(this, err)
  })
}

module.exports = Helper
