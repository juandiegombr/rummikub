const cors = require('cors')
const express = require('express')
const http = require('http')
const { Server } = require("socket.io")
const path = require('path')
const { v4 } = require('uuid')

const TileService = require('./domain/tile')
const DB = require('./db')
const { initializeSocketService } = require('./services/socket')
const { generateGameCode } = require('./helpers')

const app = express()
app.use(cors())
app.use(express.static(path.join(__dirname.replace('/src', ''), 'web/build')));

const server = http.createServer(app)
const io = new Server(server)

initializeSocketService(io)

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
  const userId = v4()
  const initialTiles = TileService.shuffle(TileService.generateTiles())
  const playerTiles = initialTiles.splice(0, 14)
  const data = {
    code: generateGameCode(),
    tiles: TileService.shuffle(TileService.generateTiles()),
    grid: {},
    players: {
      [userId]: playerTiles
    }
  }
  DB.getGames()[data.code] = data
  res.json({ userId, gameCode: data.code })
})

app.get('/api/game/join/:gameCode', (req, res) => {
  const gameCode = req.params.gameCode
  const game = DB.getGames()[gameCode]
  if (game) {
    const userId = v4()
    game.players[userId] = game.tiles.splice(0, 14)
    res.json({ userId, gameCode })
    return
  }
  res.sendStatus(404)
})

app.get('/api/game/rejoin/:gameCode', (req, res) => {
  const gameCode = req.params.gameCode
  const userId = req.get('x-user-id')
  const game = DB.getGames()[gameCode]
  if (!game) {
    res.sendStatus(404)
    return
  }
  if (!game.players[userId]) {
    res.sendStatus(403)
    return
  }
  res.json({ userId, gameCode })
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname.replace('/src', '') + '/web/build/index.html'));
})

module.exports = { app, server, io }
