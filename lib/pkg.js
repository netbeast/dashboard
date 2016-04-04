// Improved gzip: avoid packages and '.git' folders
var path = require('path')
var fs = require('fs')
var fstream = require('fstream')
var tar = require('tar')
var zlib = require('zlib')
var Ignore = require('fstream-ignore')

module.exports = function (dir, options) {
  const from = dir || './'
  const to = options.to || path.join('./', 'netbeast-app.tar.gz')

  _quitIfNotExists(from)
  _quitIfExists(to)

  console.log('> Packaging app from %s to %s', from, to)

  Ignore({path: from, ignoreFiles: ['.ignorepkg', '.gz']})
  .on('child', function (c) {
    console.error(c.path.substr(c.root.path.length + 1))
  })
  .pipe(tar.Pack())    // Convert the directory to a .tar file
  .pipe(zlib.Gzip())   // Compress the .tar file
  .pipe(fstream.Writer({ 'path': to }))

  console.log('> The compression has ended!')

  // App functions
  function _quitIfExists (file) {
    if (fs.existsSync(file)) {
      console.log("> Path '%s' already exists", file)
      process.exit(0)
    }
  }

  function _quitIfNotExists (file) {
    if (!fs.existsSync(file)) {
      console.log("> Path '%s' does not exists", file)
      process.exit(0)
    }
  }
}
