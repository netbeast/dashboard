// var stop = require('./stop')
// var launch = require('./launch')
var request = require('request')

module.exports = function (app) {
  console.log('Restarting app ' + app + '...')

  var url = 'http://' + 'localhost' + ':' + '8000' + '/api/activities/' + app
  request.del(url, function (err, resp, body) {
    if (err) throw err
    console.log('%s responded code %s\n%s', url, resp.statusCode, body)

    request.post(url, function (err, resp, body) {
      if (err) throw err
      console.log('%s responded code %s\n%s', url, resp.statusCode, body)
    })
  })
  // stop(app)
  // launch(app)
}
