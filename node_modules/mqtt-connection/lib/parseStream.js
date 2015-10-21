
var through = require('through2')
  , build   = require('mqtt-packet').parser

function parseStream() {
  var parser  = build()
    , stream  = through.obj(process)

  parser.on('packet', push)
  parser.on('error', stream.emit.bind(stream, 'error'))

  function process(chunk, enc, cb) {
    parser.parse(chunk)
    cb();
  }

  function push(packet) {
    stream.push(packet)
  }

  return stream
}

module.exports = parseStream;
