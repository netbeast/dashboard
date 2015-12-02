var dgram = require('dgram')

var freeport = require('freeport')
var Spinner = require('cli-spinner').Spinner

module.exports = function (done) {
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

    var spinner = new Spinner('Looking for netbeasts... %s')
    spinner.setSpinnerString('|/-\\')
    spinner.start()

    // Poll N times for Netbeast router's in subnet
    // =====================================
    const N = 3
    for (var i = 0; i < N; i++) {
      setTimeout(function () {
        client.send(msg, 0, msg.length, MCAST_PORT, MCAST_IP, function (err, bytes) {
          if (err) throw err
        })
      }, i * 1000)
    }

    // Close client after N attempts
    setTimeout(function () {
      client.close()
      spinner.stop()
      if (result.length === 0) {
        console.log('No Netbeast routers found in subnet.')
      }
      console.log('\nDone.\n')

      if (typeof done === 'function') return done(result)
    }, N * 1000)
  })

  client.on('message', function (msg, req) {
    var beast = { address: req.address, port: msg.toString() }
    if (_notListed(result, beast)) {
      if (result.length === 0) {
        console.log('\n# Netbeast at reach')
        console.log('=====================')
      }
      console.log('* Netbeast alive at %s:%s', beast.address, beast.port)
      result.push(beast)
      if (typeof done === 'function') return done(result)
    }
  })
}

function _notListed (arr, obj) {
  var notListed = true
  arr.forEach(function (item) {
    if (item.address === obj.address) {
      notListed = false
    }
  })
  return notListed
}
