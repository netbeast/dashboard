var path = require('path')
var multer = require('multer')

var App = require('../models/app')
/*
module.exports.upload = function({
  dest: process.env.TMP_DIR,
  rename: function (fieldname) {
    console.log('in multer')
    return new Date().getTime() + '-' + fieldname
  },
  onFileUploadComplete: function (file, req, res) {
    console.log('completed ')
    req.uploadedFile = file
  }
})
*/
module.exports.upload = multer({
  dest: process.env.TMP_DIR,
  rename: function (fieldname) {
    console.log('multer def')
    return new Date().getTime() + '-' + fieldname
  }
}).any()

module.exports.process = function (req, res, next) {
  if (!req.file) return next()
  const tarball = path.join(process.env.TMP_DIR, req.file.name)
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
