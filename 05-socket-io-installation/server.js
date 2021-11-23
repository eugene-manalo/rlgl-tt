const express = require('express')
const app = express()
const server = require('http').Server(app)
const { Server } = require('socket.io')
const io = new Server(server)

app.use(express.static(`${__dirname}/public`))

server.listen(3000, () => {
  console.log(`Listening on ${server.address().port}`)
})

io.on('connection', socket => {
  console.log('a user is connected')
})