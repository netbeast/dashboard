var fs = require('fs-extra')
var path = require('path')
var broker = require('./helpers/broker')
var multer = require('multer')
var config = require('../config')
var multer = require('multer')
var Decompress = require('decompress')
var error = require('./error')
var git = require('gift')

// Checks a tmpDir and moves into the sandbox if all OK
function install (tmpDir, done) {
  var file, pkgJson, appRoot, main
  file = path.join(tmpDir, 'package.json')
  if (!fs.existsSync(file)) return done('noPkgJson')

  pkgJson = fs.readJsonSync(file, {throws: false})
  if (!pkgJson) return done('badJson')

  appRoot = path.join(config.appsDir, pkgJson.name)
  if (fs.existsSync(appRoot)) return done('appExists')

  // Check if main is an executable file
  main = path.resolve(tmpDir, pkgJson.main)
  if (!fs.existsSync(main)) return done('noMainExe')
  else fs.chmodSync(main, '700')

  fs.move(tmpDir, appRoot, function (err) {
    if (err) return done(err)
    done(null, pkgJson)
  })
}

module.exports.multer = multer({
  dest: config.tmpDir,
  rename: function (fieldname, filename, req, res) {
    return new Date().getTime() + '-' + filename
  },
  onFileUploadStart: function (file, req, res) {
    var fname = file.name
    var ext = [fname.split('.')[1], fname.split('.')[2]].join('.')
    console.log('Uploading file with extension ' + ext)
    if (ext !== 'tar.gz' && ext !== 'tgz.') {
      error.handle('errorMime', res)
      return false
    }
  },
  onFileUploadComplete: function (file, req, res) {
    req.uploadedFile = file
  }
})

module.exports.process = function (req, res, next) {
  if (!req.uploadedFile) return next()

  var file = req.uploadedFile
  var tmpDir = path.join(config.appsDir, '' + new Date().getTime())
  var tarball = path.join(config.tmpDir, file.name)
  new Decompress({mode: '755'}).src(tarball)
  .dest(tmpDir).use(Decompress.targz({strip: 1}))
  .run(function (err) {
    if (err) return next(err)

    install(tmpDir, function (err, appJson) {
      if (err) return error.handle(err, res)

      fs.remove(tmpDir, function (err) {
        if (err) return next(err)
      })

      fs.remove(tarball, function (err) {
        if (err) return next(err)
      })

      res.status(204).end()
    })
  })
}

module.exports.git = function (req, res, next) {
  if (!req.body.url) return next()

  var tmpDir = path.join(config.tmpDir, '' + new Date().getTime())
  console.log('Cloning from git...')

  git.clone(req.body.url, tmpDir, function (err, repo) {
    if (err) return next(err)

    install(repo.path, function (err, appJson) {
      if (err) return next(err)

      res.status(204).end()
    })
  })
}
