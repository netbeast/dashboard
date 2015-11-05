var launcher = require('./launcher')
var App = require('./models/app')
var config = require('../config')
var async = require('async')
var path = require('path')
var fs = require('fs')

// start apps that must be initialized on boot
module.exports = function _bootOnLoad () {
  fs.readdir(config.appsDir, function (err, files) {
    if (err) throw err

    async.mapSeries(files, function (file, callback) {
      App.getPackageJson(path.join(config.appsDir, file, 'package.json'),
      function (err, data) {
        if (err) return callback(err)

        if (data.netbeast && data.netbeast.bootOnLoad) {
          launcher.boot(file, function (err, port) {
            if (err) return callback(err)
            console.info('launched app on port %s', port)
          })
        }
      })
    })
  })
}
