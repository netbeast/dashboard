var path = require('path')
var fs = require('fs-extra')
var async = require('async')

var broker = require('../helpers/broker')
var NotFound = require('../util/not-found')
var InvalidFormat = require('../util/invalid-format')
var _install = require('./_install')

var App = module.exports = {}
const APPS_DIR = process.env.APPS_DIR

App.all = function (done) {
  fs.readdir(APPS_DIR, function (err, files) {
    if (err) return done(err)
    files = files.filter(function (file) {
      return file !== 'installed_apps_live_here'
    })
    async.map(files, App.getPackageJson, done)
  })
}

App.delete = function (app, done) {
  if (!fs.existsSync(path.join(APPS_DIR, app))) {
    return done(new NotFound(app + ' is not installed'))
  }

  broker.info('Uninstalling ' + app + '...')
  fs.remove(path.join(APPS_DIR, app), done)
}

App.getPackageJson = function (app, done) {
  if (!fs.existsSync(path.join(APPS_DIR, app))) {
    return done(new NotFound(app + ' is not installed'))
  }
  fs.readJson(path.join(APPS_DIR, app, 'package.json'), done)
}

App.install = function (bundle, done) {
  if (_isUrl(bundle)) return _install.from.url(bundle, done)

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

App.plugins = function (done) {
  fs.readdir(APPS_DIR, function (err, files) {
    if (err) return done(err)
    files = files.filter(function (file) {
      return file !== 'installed_apps_live_here'
    })
    async.map(files, App.getPackageJson, function (err, plugins) {
      plugins = plugins.filter(function (plugin) {
      return plugin.netbeast && plugin.netbeast.type === 'service'
      })
      done(null, plugins)
    })
  })
}