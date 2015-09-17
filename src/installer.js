var fs = require('fs-extra')
, path = require('path')
, www = require('../www')
, multer = require('multer')
, config = require('../config')
, npm = require('npm')

module.exports = multer({
  dest: config.tmpDir,
  rename: function (fieldname, filename, req, res) {
    return '' + new Date().getTime() + '-' + filename
  },
  onFileUploadComplete: function (file, req, res) {
    var tarball = path.join(config.tmpDir, file.name)
    npm.load({}, function () {
      npm.commands.install(config.sandbox, tarball, function(err) {
        if (err && err.code === 'ENOENT') {
          www.io.emit('stderr', 'Sorry, this is not a valid xway app')
        } else if (err) {
          www.io.emit('stderr', err.toString())
          throw err
        }
        www.io.emit('stdout', 'Installation ended')
        res.status(204).send()

        fs.remove(tarball, function(err) {
          if (err) throw err
        })
      })
    })
  }
})