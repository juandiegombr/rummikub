const cors = require('cors')
const express = require('express')
const http = require('http')
const { Server } = require("socket.io")

const TileService = require('./domain/tile')
const { generateGameCode } = require('./helpers')

const app = express()
app.use(cors())

const server = http.createServer(app)
const io = new Server(server)

const PORT = 5000
const GAMES = {}

const Socket = {
  getById: (id) => io.sockets.sockets.get(id)
}

const Room = {
  getSockets: async (room) => {
    const ids = await io.in(room).allSockets()
    return [...ids].map((id) => {
      return Socket.getById(id)
    })
  }
}

function shuffleTiles(socketsInRoom, game) {
  socketsInRoom.forEach((playerSocket, index) => {
    const gameTiles = GAMES[game.code].tiles
    const positions = [
      [0, 14],
      [14, 28],
    ]
    playerSocket.emit('game:start', gameTiles.slice(...positions[index]))
  })
}

async function afterUserJoined(game, socket) {
  console.log('Websocket: ', game.code)

  const roomName = `room:${game.code}`

  socket.join(roomName)
  socket.to(roomName).emit('user:joined')

  const socketsInRoom = await Room.getSockets(roomName)

  if (socketsInRoom.length === 2) {
    shuffleTiles(socketsInRoom, game)
  }
}

io.on('connection', (socket) => {
  console.log('Websocket: User connected')

  socket.on('game:create', () => {
    const game = { code: 'BBBB'}
    socket.emit('game:create', game)
    socket.join(`room:${game.code}`)
  })

  socket.on('game:join', async (game) => {
    await afterUserJoined(game, socket)
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
  const data = {
    code: generateGameCode(),
    tiles: TileService.shuffle(TileService.generateTiles()),
  }
  GAMES[data.code] = data
  res.json(data)
})

app.get('/game/join/:gameCode', (req, res) => {
  const data = { code: req.params.gameCode }
  if (GAMES[data.code]) {
    res.json(data)
    return
  }
  res.sendStatus(404)
})

server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
});
