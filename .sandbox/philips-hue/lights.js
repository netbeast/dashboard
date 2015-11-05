
var fs = require('fs')
var	async = require('async')
var	hue = require('node-hue-api')
var	HueApi = require('node-hue-api').HueApi
var	hueapi = new HueApi()

var ipbridge
var api

module.exports = function (callback) {
  async.waterfall([
    hue.nupnpSearch,
    function (result, callback) {
      ipbridge = JSON.stringify(result[0].ipaddress)
      ipbridge = ipbridge.split('"')[1]
      console.log('Hue Bridges Found: ' + ipbridge)
      callback.call(this, null)
    },

    function createUser (callback) {
      fs.readFile('username.txt', function (err, user) {
        if (user) {
          callback(null, user.toString())
        } else {
          hueapi.createUser(ipbridge, null, null, callback)
        }
      })
    },

    function (user, callback) {
      if (user === null && ipbridge !== null) {
        this.createUser()
      } else {
        fs.writeFile('username.txt', user)
        callback(null, user)
      }
    },

    function FindLights (user, callback) {
      api = new HueApi(ipbridge, user)
      callback(null, api)
    }

  ], callback)
}
