/*
* A script to read and interpratate
* the server configuration file 'config.json'
* this is made to simplify accessing to the json,
* now you can type: require('config.js')
* and parse it smart.
*/

var fs = require('fs-extra')
var async = require('async')
var exec = require('child_process').exec
var path = require('path')
var launcher = require('../src/launcher')

var root = path.join(__dirname, '..')
var userFile = path.join(__dirname, 'user.json')

var config = module.exports = {
  port: 80,
  tmpDir: '/tmp',
  configDir: __dirname,
  sandbox: path.join(root, './.sandbox'),
  publicDir: path.join(root, './public'),
  appsDir: path.join(root, './.sandbox/node_modules')
}

console.log('[Default config]')
console.dir(config)

// start apps that must be initialized on boot
fs.readdir(config.appsDir, function (err, files) {
  if (err) return callback(err)

  async.mapSeries(files, function (file, callback) {
    var pkgJson = path.join(config.appsDir, file, 'package.json')
    fs.readJson(pkgJson, function (err, data) {
      if (err) return callback(err)

      if (data.bootOnLoad) {
        launcher.boot(file, function(err, port) {
          if (err) return callback(err)
          console.info('launched app on port %s', port)
        })
      }
    })
  })
})
