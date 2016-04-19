var Promise = require('bluebird')
var chalk = require('chalk')

var App = require('./models/app')
var Activity = require('./models/activity')

// start apps that must be initialized on boot
module.exports = function bootOnload () {
  App.modules(function (err, apps) {
    if (err) throw err

    Promise.map(apps, function (app) {
      if (!app || !app.netbeast || !app.netbeast.bootOnLoad) return Promise.resolve()

      Activity.boot(app.name, function (err, port) {
        if (err) return Promise.reject(err)

        console.info('🚀  [booting] %s launched on port %s ', app.name, port.port)
        Promise.resolve(port.port)
      })
    }).catch(function (err) {
      if (err) throw err
    })
  })
}
