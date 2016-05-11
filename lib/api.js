var request = require('superagent')

module.exports = {
  restart: function (app) {
    var url = 'http://' + 'localhost' + ':' + '8000' + '/api/activities/' + app
    request.del(url, function (err, resp, body) {
      if (err) throw err

        request.post(url, function (err, resp, body) {
          if (err) throw err
            console.log('Done.')
        })
    })
  },
  stop: function (app) {
    var url = 'http://' + 'localhost' + ':' + '8000' + '/api/activities/' + app
    request.del(url, function (err, resp, body) {
      if (err) throw err
        console.log('Done.')
    })
  },
  launch: function (app) {
    var url = 'http://' + 'localhost' + ':' + '8000' + '/api/activities/' + app

    request.post(url, function (err, resp, body) {
      if (err) throw err
        console.log('Done.')
    })
  },
  uninstall: function (app) {
    console.log('Uninstalling app ' + app + '...')

    var url = 'http://' + 'localhost' + ':' + '8000' + '/api/apps/' + app
    request.del(url, function (err, resp, body) {
      if (err) throw err
        console.log('%s responded code %s\n%s', url, resp.statusCode, body)
    })
  }
}