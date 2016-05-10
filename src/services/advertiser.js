var dgram = require('dgram')
var deamon = dgram.createSocket('udp4')

// aurum number port
deamon.bind(16180, function () {
  process.env.IPs.split(',').forEach(function (iface) {
    try { deamon.addMembership('239.0.16.18', iface) } catch (err) { console.trace(err) }
  })
})

deamon.on('message', function (msg, req) {
  console.log('%s from %s:%s', msg, req.address, req.port)
  // answer from the interface we got the request
  var message = new Buffer(JSON.stringify({port: process.env.PORT, secure_port: process.env.SECURE_PORT}))
  deamon.send(message, 0, message.length, req.port, req.address, function (err, bytes) {
    if (err) throw err
    console.log('[deamon] UDP message "%s" sent to %s:%s', message, req.address, req.port)
  })
})
