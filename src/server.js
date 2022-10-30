const cors = require('cors')
const express = require('express')
const http = require('http')
const { Server } = require("socket.io")
const path = require('path')

const TileService = require('./domain/tile')
const { GAMES } = require('./db')
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
