var path = require('path')
var multer = require('multer')

var App = require('../models/app')

module.exports.upload = multer({
  dest: process.env.TMP_DIR,
  rename: function (fieldname) {
    return new Date().getTime() + '-' + fieldname
  },
  onFileUploadComplete: function (file, req, res) {
    req.uploadedFile = file
  }
}).any()

// module.exports = upload.any()

module.exports.process = function (req, res, next) {
  if (!req.uploadedFile) return next()

  const tarball = path.join(process.env.TMP_DIR, req.uploadedFile.name)
  App.install(tarball, function (err, appJson) {
    if (err) return next(err)
    res.json(appJson)
  })
}

module.exports.git = function (req, res, next) {
  if (!req.body.url) return next()

  App.install(req.body.url, function (err, appJson) {
    if (err) return next(err)
    res.json(appJson)
  })
}
