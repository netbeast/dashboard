var dgram = require('dgram')
var freeport = require('freeport')

module.exports = function (callback) {
  var result = []
  var client = dgram.createSocket('udp4')
  const MCAST_IP = '239.0.16.18'
  const MCAST_PORT = 16180

  freeport(function (err, port) {
    if (err) throw err
    client.bind(port, '0.0.0.0')
  })

  client.on('listening', function () {
    var msg = new Buffer('hi')

    console.log('Scanning...')

    // Poll N times for Netbeast router's in subnet
    // =====================================
    for(var i = 0; i < 2; i++) {
      setTimeout(function () {
        client.send(msg, 0, msg.length, MCAST_PORT, MCAST_IP,
          function (err, bytes) {
            if (err) throw err
          })
        }, i * 1000)
      }

      // Close client after N attempts
      setTimeout(function () {
        client.close()
        if (result.length === 0)
        console.log('No Netbeast routers found in subnet.')
        console.log('\nDone.\n')

        // Publish results to callback
        if (typeof callback === 'function')
        callback.call(this, result)

      }, i * 1000)
    })

    client.on('message', function (msg, req) {
      if (result.indexOf(req.address) === -1) {
        if (result.length === 0) {
          console.log('\n# netbeast at reach')
          console.log('================')
        }
        console.log('* %s [signature: %s]', req.address, msg)
        result.push(req.address)
      }
    })
  }
