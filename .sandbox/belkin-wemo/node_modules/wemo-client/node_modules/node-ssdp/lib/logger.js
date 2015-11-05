/**
 * Use logging facilities when available
 * and stub it out when not.
 */

try {
  var bunyan = require('bunyan')
  var PrettyStream = require('bunyan-prettystream')

  process.stdout.setMaxListeners(100)
} catch(e) {
  module.exports = function () {
    var stubs = {};

    ['trace', 'debug', 'info', 'warn', 'error', 'fatal'].forEach(function (level) {
      stubs[level] = function () {}
    })

    return stubs
  }

  return
}

module.exports = function(config) {
  if (!config) config = {}
  
  var loggerConfig = {
    name: config.logger_name,
    streams: [],
    src: false
  }
  
  if (config.logLevel) {
    if (config.logJSON) {
      loggerConfig.streams.push({
        level: 'error',
        stream: process.stdout
      })
    } else {
      var prettyStdOut = new PrettyStream()
      prettyStdOut.pipe(process.stdout)

      loggerConfig.streams.push({
        level: 'error',
          stream: prettyStdOut,
          type: 'raw'
      })
    }
  }

  var logger = bunyan.createLogger(loggerConfig)

  if (process.env.LOG_LEVEL) {
    logger.level(process.env.LOG_LEVEL)
  } else {
  config.logLevel && logger.level(config.logLevel)
  }

  // enable call source location in the log
  if (logger.level() <= 20) {
    logger.src = true
  }

  return logger
}
