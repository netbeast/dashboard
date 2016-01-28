#!/usr/bin/env node

/*
  We uses this File to launch the pluging, so you don´t need
  to change nothing.
*/

var app = require('./src')
var cmd = require('commander')
var http = require('http')

cmd
  .version('0.1.42')
  .option('-p, --port <n>', 'Port to start the HTTP server', parseInt)
  .parse(process.argv)

// parse port and set variable
var port = cmd.port || 80
app.set('port', port)

// Launch server with web sockets
var server = http.createServer(app)

// Listen on provided port, on all network interfaces.
server.listen(port)

server.on('listening', function () {
  console.log('http server started on %s:%s',
    server.address().address,
    server.address().port)
})

server.on('error', function (error) {
  if (error.syscall !== 'listen') {
    throw error
  }
  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
})
