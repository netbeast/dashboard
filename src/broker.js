var chalk = require('chalk')

module.exports = function (socket) {
  console.log(chalk.grey('ws:// user connected'))

  socket.on('push', function (msg) {
    console.log('Received push of:', msg)
    console.log(msg)
    socket.broadcast.emit('news', msg)
  })

  socket.on('disconnect', function () {
    console.log(chalk.grey('ws:// user disconnected'))
  })
}
