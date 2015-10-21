
var generateStream  = require('./lib/generateStream')
  , parseStream     = require('./lib/parseStream')
  , Reduplexer      = require('reduplexer')
  , inherits        = require('inherits')
  , setImmediate    = global.setImmediate

setImmediate = setImmediate || function(func) {
  process.nextTick(func);
}

function emitPacket(packet) {
  this.emit(packet.cmd, packet)
}

function Connection(duplex, opts) {
  if (!(this instanceof Connection)) {
    return new Connection(duplex, opts)
  }

  opts = opts || {}

  var inStream  = generateStream()
    , outStream = parseStream(opts)

  duplex.pipe(outStream)
  inStream.pipe(duplex)

  this.stream = duplex

  duplex.on('error', this.emit.bind(this, 'error'))
  duplex.on('close', this.emit.bind(this, 'close'))

  Reduplexer.call(this, inStream, outStream, { objectMode: true })

  // MQTT.js basic default
  if (opts.notData !== true)
    this.on('data', emitPacket)
}

inherits(Connection, Reduplexer)

;['connect',
  'connack',
  'publish',
  'puback',
  'pubrec',
  'pubrel',
  'pubcomp',
  'subscribe',
  'suback',
  'unsubscribe',
  'unsuback',
  'pingreq',
  'pingresp',
  'disconnect'].forEach(function(cmd) {
    Connection.prototype[cmd] = function(opts, cb) {
      opts = opts || {}
      opts.cmd = cmd;

      // flush the buffer if needed
      // UGLY hack, we should listen for the 'drain' event
      // and start writing again, but this works too
      this.write(opts)
      if (cb)
        setImmediate(cb)
    }
  });

Connection.prototype.destroy = function() {
  if (this.stream.destroy)
    this.stream.destroy()
  else
    this.stream.end()
}

module.exports = Connection
module.exports.parseStream = parseStream
module.exports.generateStream = generateStream
