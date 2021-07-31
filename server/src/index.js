const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

const PORT = 5000

io.on('connection', (socket) => {
  console.log('Websocket: User connected')
  socket.broadcast.emit('JOINED')

  socket.on('disconnect', () => {
    socket.broadcast.emit('LEAVED')
    console.log('Websocket: User disconnected')
  });
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/users/', (req, res) => {
  const data = [
    {
      id: 1,
      name: 'John Doe__',
      email: 'johndoe@gmail.com',
    }
  ]
  res.json(data)
})

server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
});