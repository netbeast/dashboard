var chalk = require('chalk')

module.exports = function (socket) {
  console.log(chalk.grey('[broker] user connected'))

  socket.on('push', function (msg) {
    socket.broadcast.emit('news', msg)
  })

  socket.on('disconnect', function () {
    console.log(chalk.grey('[broker] user disconnected'))
  })
}
