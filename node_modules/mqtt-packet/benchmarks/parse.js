
var mqtt    = require('../')
  , parser  = mqtt.parser()
  , max     = 10000000
  , i
  , start   = Date.now() / 1000
  , time

for (i = 0; i < max; i++) {
  parser.parse(new Buffer([
    48, 10, // Header
    0, 4, // Topic length
    116, 101, 115, 116, // Topic (test)
    116, 101, 115, 116 // Payload (test)
  ]))
}

time = Date.now() / 1000 - start
console.log('Total packets', max)
console.log('Total time', Math.round(time * 100) / 100)
console.log('Packet/s', max / time)
