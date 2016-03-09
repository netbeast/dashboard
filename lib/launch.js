var request = require('superagent')

module.exports = function (app) {
  console.log('Launching app ' + app + ' to Netbeast router...')

  var url = 'http://' + 'localhost' + ':' + '8000' + '/api/activities/' + app

  request.post(url, function (err, resp, body) {
    if (err) throw err
    console.log('%s responded code %s\n%s', url, resp.statusCode, body)
  })
}
