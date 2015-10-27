var util = require('util')

function InvalidFormat (message) {
  Error.call(this)
  Error.captureStackTrace(this, arguments.callee)
  this.message = message || 'Invalid Format'
  this.statusCode = 403
}

util.inherits(InvalidFormat, Error)

module.exports = InvalidFormat
