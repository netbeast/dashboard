var async = require('async')
var chalk = require('chalk')

var App = require('./models/app')
var Activity = require('./models/activity')

// start apps that must be initialized on boot
module.exports = function bootOnload () {
  App.modules(function (err, apps) {
    if (err) throw err

    async.map(apps, function (app, done) {
      if (!app.netbeast || !app.netbeast.bootOnLoad) return done()

      Activity.boot(app.name, function (err, port) {
        if (err) return done(err)

        console.info('🚀  [booting] %s launched on port %s ', app.name, port.port)
        done(null, port.port)
      })
    },
    function (err) {
      if (err) throw err
    })
  })
}
