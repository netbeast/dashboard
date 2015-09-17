var fs = require('fs-extra')
, path = require('path')
, broker = require('./helpers/broker')
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
          broker.emit('stderr', 'Sorry, this is not a valid xway app')
        } else if (err) {
          broker.emit('stderr', err.toString())
          throw err
        }
        broker.emit('stdout', 'Installation ended')
        res.status(204).send()

        fs.remove(tarball, function(err) {
          if (err) throw err
        })
      })
    })
  }
})