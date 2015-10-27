var util = require('util')

function NotFound (message) {
  Error.call(this)
  Error.captureStackTrace(this, arguments.callee)
  this.message = message || 'Not Found'
  this.statusCode = 404
}

util.inherits(NotFound, Error)

module.exports = NotFound
