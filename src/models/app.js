var path = require('path')
var fs = require('fs-extra')
var async = require('async')

var config = require('../../config')
var broker = require('../helpers/broker')
var NotFound = require('../util/not-found')
var InvalidFormat = require('../util/invalid-format')
var _install = require('./_install')

var App = module.exports = {}

App.all = function (done) {
  fs.readdir(config.appsDir, function (err, files) {
    if (err) return done(err)

    async.map(files, App.getPackageJson, done)
  })
}

App.delete = function (app, done) {
  var _path = path.join(config.appsDir, app)
  if (!fs.existsSync(_path)) return done(new NotFound(app + ' is not installed'))

  broker.emit('stdout', 'Uninstalling ' + app + '...')
  fs.remove(_path, done)
}

App.getPackageJson = function (app, done) {
  if (!fs.existsSync(path.join(config.appsDir, app))) {
    return done(new NotFound(app + ' is not installed'))
  }
  fs.readJson(path.join(config.appsDir, app, 'package.json'), done)
}

App.install = function (bundle, done) {
  if (_isUrl(bundle)) return _install.from.git(bundle, done)

  fs.lstat(bundle, function (err, stats) {
    if (err) return done(err)

    if (stats.isDirectory()) {
      _install.from.dir(bundle, done)
    } else if (stats.isFile()) {
      _install.from.tar(bundle, done)
    } else {
      return done(new InvalidFormat('App does not have proper format'))
    }
  })
}

function _isUrl (s) {
  var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
  return regexp.test(s)
}
