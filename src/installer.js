var path = require('path')
var multer = require('multer')

var config = require('config')
var broker = require('src/helpers/broker')
var error = require('src/util/error')
var App = require('src/models/app')

module.exports.multer = multer({
  dest: config.tmpDir,
  rename: function (fieldname, filename, req, res) {
    return new Date().getTime() + '-' + filename
  },
  onFileUploadStart: function (file, req, res) {
    var fname = file.name
    var ext = [fname.split('.')[1], fname.split('.')[2]].join('.')
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

  var tarball = path.join(config.tmpDir, req.uploadedFile.name)
  App.install(tarball, function (err) {
    if (err) return error.handle(err, res)
    res.status(204).end()
  })
}

module.exports.git = function (req, res, next) {
  if (!req.body.url) return next()

  broker.notify('Installing from git...')
  App.install(req.body.url, function (err, repo) {
    if (err) return next(err)
    res.status(204).end()
  })
}
