var fs = require('fs-extra')
, path = require('path')
, www = require('../www')
, multer = require('multer')
, config = require('../config')
, error = require('./error')
, npm = require('npm')

Installer = {}

Installer.multer = multer({
  dest: config.tmpDir,
  rename: function (fieldname, filename, req, res) {
    return '' + new Date().getTime() + '.tgz'
  },
  onFileUploadComplete: function (file, req, res) {
    var tarball = path.join(config.tmpDir, file.name)
    npm.load({}, function () {
      // Prompts message of not found, whatafuck
      npm.commands.install(config.sandbox, tarball, function() {
        fs.remove(tarball, function(err) {
          if (err) throw err
            www.io.emit('stdout', 'Removing temporary files...')
        })        
        // check package health
        www.io.emit('stdout', 'Installation successful')
      });
    })
  }
})

module.exports = Installer


// Checks a tmpDir and moves into the sandbox if all OK
// function install(tmpDir, callback) {

//   var file, pkgJson, appRoot, logo, main

//   file = path.join(tmpDir, 'package.json')

//   if (!fs.existsSync(file))
//     return callback.call(this, 'noPkgJson')

//   pkgJson = fs.readJsonSync(file, {throws: false})

//   if (!pkgJson)
//     return callback.call(this, 'badJson')

//   www.io.emit('stdout', 'Attempting to install...')
//   appRoot = path.join(config.appsDir, pkgJson.name)

//   if (fs.existsSync(appRoot)) {
//     fs.remove(tmpDir, function(err) {
//       if (err) throw err
//     })
//     return callback.call(this, 'appExists')
//   }

//   // Check if main is an executable file
//   main = path.resolve(tmpDir, pkgJson.main)
//   if (!fs.existsSync(main))
//     return callback.call(this, 'noMainExe') 
//   else
//     fs.chmodSync(main, '700')

//   fs.move(tmpDir, appRoot, function (err) {
//     if (err) {
//       console.error(err)
//       throw err
//     }

//     callback.call(this, null)
//   })
// }