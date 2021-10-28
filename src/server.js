const cors = require('cors')
const express = require('express')
const http = require('http')
const { Server } = require("socket.io")
const path = require('path')

const TileService = require('./domain/tile')
const { generateGameCode } = require('./helpers')

const app = express()
app.use(cors())
app.use(express.static(path.join(__dirname.replace('/src', ''), 'web/build')));

const server = http.createServer(app)
const io = new Server(server)

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

function splitTiles(game) {
  const gameTiles = GAMES[game.code].tiles
  return [gameTiles.slice(0, 14), gameTiles.slice(14, 28)]
}

async function joinRoom(game, socket) {
  const roomName = `room:${game.code}`
  socket.join(roomName)
  const socketsInRoom = await Room.getSockets(roomName)
  console.log(`Websocket: ${socketsInRoom.length} user joined to the game ${game.code}`)
  return socketsInRoom
}

async function afterUserJoined(game, socket) {
  const socketsInRoom = await joinRoom(game, socket)


  if (socketsInRoom.length === 2) {
    const playersTiles = splitTiles(game)
    socketsInRoom.forEach((playerSocket, index) => {
      playerSocket.emit('game:start', playersTiles[index])
    })
  }
}

io.on('connection', (socket) => {
  console.log('Websocket: User connected')

  socket.on('game:join', async ({ data: game }) => {
    await afterUserJoined(game, socket)
  })

  socket.on('game:move', async ({ room, data: move }) => {
    const code = room.split(':')[1]
    const game = GAMES[code]
    game.grid = {...game.grid, [move.tile.id]: move}
    const socketsInRoom = await Room.getSockets(room)
    socketsInRoom.forEach(socket => {
      socket.to(room).emit('game:move', game.grid)
    })
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('LEAVED')
    console.log('Websocket: User disconnected')
  });
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

app.get('/api/game/create/', (req, res) => {
  const data = {
    code: generateGameCode(),
    tiles: TileService.shuffle(TileService.generateTiles()),
    grid: {},
  }
  GAMES[data.code] = data
  res.json({ code: data.code })
})

app.get('/api/game/join/:gameCode', (req, res) => {
  const data = { code: req.params.gameCode }
  if (GAMES[data.code]) {
    res.json(data)
    return
  }
  res.sendStatus(404)
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname.replace('/src', '') + '/web/build/index.html'));
})

module.exports = { app, server, io }
