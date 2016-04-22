
// Load environment variables
process.chdir(__dirname + '/..')
require('dotenv').load()

var os = require('os')

var interfaces = os.networkInterfaces()
var addresses = []
for (var i in interfaces) {
  for (var j in interfaces[i]) {
    var address = interfaces[i][j]
    if (address.family === 'IPv4' && !address.internal) {
      addresses.push(address.address)
    }
  }
}

process.env.IPs = addresses.join(',')
