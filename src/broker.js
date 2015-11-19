var chalk = require('chalk')

module.exports = function (socket) {
  console.log(chalk.grey('user connected'))

  socket.on('push', function (str) {
    socket.broadcast.emit('news', str)
  })

  socket.on('disconnect', function () {
    console.log(chalk.grey('user disconnected'))
  })
}
