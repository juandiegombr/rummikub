const cors = require('cors')
const express = require('express')
const http = require('http')
const { Server } = require("socket.io")
const path = require('path')

const DB = require('./db')
const { initializeSocketService } = require('./services/socket')

const app = express()
app.use(cors())
app.use(express.static(path.join(__dirname.replace('/src', ''), 'web/build')));

const server = http.createServer(app)
const io = new Server(server)

initializeSocketService(io)

app.get('/api/user/:userName', (req, res) => {
  const name = req.params.userName
  const user = DB.User.create({ name })
  res.json(user)
})

app.get('/api/game/create/', (req, res) => {
  const userId = req.get('x-user-id')
  const user = DB.User.get({ id: userId })
  const game = DB.createGame(user)
  res.json({ userId: user.id, gameCode: game.code })
})

app.get('/api/game/join/:gameCode', (req, res) => {
  const gameCode = req.params.gameCode
  const userId = req.get('x-user-id')
  const user = DB.User.get({ id: userId })
  const game = DB.Game.getByCode(gameCode)
  if (game) {
    res.json({ userId: user.id, gameCode: game.code })
    return
  }
  res.sendStatus(404)
})

app.get('/api/game/rejoin/:gameCode', (req, res) => {
  const gameCode = req.params.gameCode
  const userId = req.get('x-user-id')
  const game = DB.Game.getByCode(gameCode)
  const user = DB.User.get({ id: userId })
  if (!game) {
    res.sendStatus(404)
    return
  }
  if (!user || user.gameId !== game.id) {
    res.sendStatus(403)
    return
  }
  res.json({ userId, gameCode })
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname.replace('/src', '') + '/web/build/index.html'));
})

module.exports = { app, server, io }
