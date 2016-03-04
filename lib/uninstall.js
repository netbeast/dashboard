var request = require('superagent')

module.exports = function (app) {
  console.log('Uninstalling app ' + app + '...')

  var url = 'http://' + 'localhost' + ':' + '8000' + '/api/apps/' + app
  request.del(url, function (err, resp, body) {
    if (err) throw err
    console.log('%s responded code %s\n%s', url, resp.statusCode, body)
  })
}
