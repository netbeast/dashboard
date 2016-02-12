var util = require('util')

function Forbidden (message) {
  Error.call(this)
  Error.captureStackTrace(this, arguments.callee)
  this.message = message || 'You have not enough priviledges'
  this.statusCode = 403
}

util.inherits(Forbidden, Error)

module.exports = Forbidden
