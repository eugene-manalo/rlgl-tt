const express = require('express')
const app = express()
const server = require('http').Server(app);

app.use(express.static(`${__dirname}/public`))

server.listen(3000, () => {
  console.log(`Listening on ${server.address().port}`)
})