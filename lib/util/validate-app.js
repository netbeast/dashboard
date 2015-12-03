var path = require('path')

// returns
module.exports = function _validateApp (file) {
  file = path.resolve(file)
  var ext = [file.split('.')[1], file.split('.')[2]].join('.')
  if (ext === 'tar.gz' || ext === 'tgz.') return true
  else return false
}
