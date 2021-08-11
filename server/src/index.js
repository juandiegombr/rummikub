const cors = require('cors')
const express = require('express')
const { generateGameCode } = require('./helpers')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

const PORT = 5000

app.use(cors());

const games = {}

io.on('connection', (socket) => {
  console.log('Websocket: User connected')

  socket.on('game:create', () => {
    const game = { code: 'BBBB'}
    socket.emit('game:create', game)
    socket.join(`room:${game.code}`)
  })

  socket.on('game:join', (game) => {
    console.log('Websocket: ', game)
    socket.to(`room:${game.code}`).emit('user:joined')
    socket.join(`room:${game.code}`)
  })

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

app.get('/game/create/', (req, res) => {
  const data = { code: generateGameCode() }
  games[data.code] = data
  res.json(data)
})

app.get('/game/join/:gameCode', (req, res) => {
  const data = { code: req.params.gameCode }
  if (games[data.code]) {
    res.json(data)
    return
  }
  res.sendStatus(404)
})

server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
});