var path = require('path')
var multer = require('multer')

var App = require('../models/app')
var ApiError = require('../util/api-error')

module.exports.upload = multer({
  dest: process.env.TMP_DIR,
  rename: function (fieldname, filename) {
    return new Date().getTime() + '-' + filename
  },
  fileFilter: function (req, file, done) {
    var ext = [file.originalname.split('.')[1], file.originalname.split('.')[2]].join('.')
    if (ext !== 'tar.gz' && ext !== 'tgz.' && file.mimetype !== 'application/x-gzip' && file.mimetype !== 'application/octet-stream')
      return done(null, false)
    else
      return done(null, true)
  }
}).any()

module.exports.process = function (req, res, next) {
  const module = (req.files && req.files.length > 0) ? req.files[0].path : req.body.url
  console.log('MODULE', module)
  if (!module) return next(new ApiError(422, 'App must be a tar.gz file.'))
  App.install(module, function (err, appJson) {
    if (err) return next(err)

    res.json(appJson)
  })
}
