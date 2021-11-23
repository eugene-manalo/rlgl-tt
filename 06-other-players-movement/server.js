const express = require('express')
const app = express()
const server = require('http').Server(app)
const { Server } = require('socket.io')
const io = new Server(server)

app.use(express.static(`${__dirname}/public`))

server.listen(3000, () => {
  console.log(`Listening on ${server.address().port}`)
})

const players = {}

io.on('connection', socket => {
  console.log('a user is connected')

  // new player connected
  players[socket.id] = {
    x: 336, // 400 - (32 * 2)
    y :414 // 350 + (32 * 2)
  }
  socket.emit('currentPlayers', players)

  // movement event
  socket.on('playerMovement', movement => {
    io.emit('playerMoved', { playerId: socket.id, ...movement })
  })
})

