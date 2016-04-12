var path = require('path')

var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs-extra'))

var broker = require('../helpers/broker')
var NotFound = require('../util/not-found')
var InvalidFormat = require('../util/invalid-format')
var _install = require('./_install')

var App = module.exports = {}
const APPS_DIR = process.env.APPS_DIR

App.modules = function (done) {
  fs.readdirAsync(APPS_DIR).then(function (files) {
    return Promise.filter(files, function (file, callback) {
      return fs.lstatAsync(APPS_DIR + '/' + file).then(function (stats) {
        return stats.isDirectory()
      })
    }).then(function (directories) {
      return Promise.map(directories, function (directory) {
        return new Promise(function (resolve, reject) {
          App.getPackageJson(directory, function (err, pkg) {
            if (err) return reject(err)
            return resolve(pkg)
          })
        })
      })
    }).then(function (packages) {
      return done(null, packages)
    }).catch(done)
  })
}

App.all = function (done) {
  App.modules(function (err, apps) {
    if (err) return done(err)

    const plugins = apps.filter(function (app) {
      return !(app.netbeast && app.netbeast.type === 'plugin')
    })

    done(null, plugins)
  })
}

App.plugins = function (done) {
  App.modules(function (err, apps) {
    if (err) return done(err)
    const plugins = apps.filter(function (app) {
      return app.netbeast && app.netbeast.type === 'plugin'
    })

    done(null, plugins)
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
  const dir = path.join(APPS_DIR, app)
  if (!fs.existsSync(dir)) {
    return done(new NotFound(app + ' is not installed'))
  }

  fs.readJson(path.join(dir, 'package.json'), function (err, pkg) {
    if (err && err.code === 'ENOENT') return done()
    done(err, pkg)
  })
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

App.find = function (query, done) {
  // only querying topics by the moment
  App.all(function (err, apps) {
    if (err) return done(err)

    var result = apps.filter(function (app) {
      return app.netbeast && app.netbeast.topic === query.topic
    })

    done(null, result)
  })
}

function _isUrl (s) {
  var regexp = /(git|ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
  return regexp.test(s)
}
