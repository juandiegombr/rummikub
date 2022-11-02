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
  const user = DB.User.create()
  const game = DB.createGame(user)
  res.json({ userId: user.id, gameCode: game.code })
})

app.get('/api/game/join/:gameCode', (req, res) => {
  const gameCode = req.params.gameCode
  const user = DB.User.create()
  const game = DB.Game.getByCode(gameCode)
  if (game) {
    DB.joinGame(game, user)
    res.json({ userId: user.id, gameCode: game.code })
    return
  }
  res.sendStatus(404)
})

app.get('/api/game/rejoin/:gameCode', (req, res) => {
  const gameCode = req.params.gameCode
  const userId = req.get('x-user-id')
  const game = DB.Game.getByCode(gameCode)
  if (!game) {
    res.sendStatus(404)
    return
  }
  if (!game.users.includes(userId)) {
    res.sendStatus(403)
    return
  }
  res.json({ userId, gameCode })
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname.replace('/src', '') + '/web/build/index.html'));
})

module.exports = { app, server, io }
