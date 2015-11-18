var loadBridge = require('./lights')
var request = require('request')
var config = require('../../config')

module.exports = function (callback) {
  loadBridge(function (err, api) {
    if (err) callback(err, null)
    else {
      var objects = []
      request.get(config.LOCAL_URL + '/resources?app=philips-hue',
      function (err, resp, body) {
        body = JSON.parse(body)
        if (err) callback(err, null)
        else if (body.data.length > 0) {
          body.data.forEach(function (device) {
            if (objects.indexOf(device.hook) < 0) objects.push(device.hook)
          })
        }
      })
      api.lights(function (err, lights) {
        if (err) callback(err, null)
        lights.lights.forEach(function (item) {
          var indx = objects.indexOf('/hueLights/' + item.id)
          if (indx >= 0) {
            objects.splice(indx, 1)
          } else {
            //  Registra una dos acciones (get y set) por cada bombilla
            request.post({url: config.LOCAL_URL + '/resources',
            json: {
              app: 'philips-hue',
              location: 'none',
              topic: 'lights',
              groupname: 'none',
              hook: '/hueLights/' + item.id
            }},
            function (err, resp, body) {
              if (err) callback(err, null)
            })
          }
        })
        if (objects.length > 0) {
          objects.forEach(function (hooks) {
            request.del(config.LOCAL_URL + '/resources?hook=' + hooks,
            function (err, resp, body) {
              if (err) callback(err, null)
            })
          })
        }
      })
    }
    callback(null, api)
  })
}
