var validateApp = require('./util/validate-app')
var request = require('request')
var fs = require('fs')

module.exports = function (app, target) {
  if (!validateApp(app)) return console.error('Invalid file type. Must be a tar.gz')

  console.log('Uploading app to Netbeast router...')

  var url = 'http://' + target.address + ':' + target.port + '/apps'
  var req = request.post(url, function (err, resp, body) {
    if (err) throw err
    console.log('%s responded code %s\n%s', url, resp.statusCode, body)
  })
  var form = req.form()
  form.append('file', fs.createReadStream(app))
}
