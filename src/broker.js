var chalk = require('chalk')

module.exports = function (socket) {
  console.log(chalk.grey('ws:// user connected'))

  socket.on('push', function (str) {
    console.log('Received push of %s', str)
    socket.broadcast.emit('news', str)
  })

  socket.on('disconnect', function () {
    console.log(chalk.grey('ws:// user disconnected'))
  })
}
