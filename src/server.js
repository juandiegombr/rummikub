import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import http from 'http'
import path from 'path'
import { Server } from 'socket.io'
import { fileURLToPath } from 'url'

import DB from './db/index.js'
import { Game, User } from './models/index.js'
import { Serializer } from './serializer/index.js'
import { Logger } from './services/logger/index.js'
import { initializeSocketService } from './socket/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())
app.use(express.static(path.join(__dirname.replace('/src', ''), 'web/build')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const server = http.createServer(app)
const io = new Server(server)

initializeSocketService(io)

app.post('/api/user/create/', (req, res) => {
  const name = req.body.name
  Logger.send(`Creating a new user: ${name}`)
  const user = User.create({ name })
  Logger.send(`Created a new user: ${name}`)
  res.json(user)
})

app.get('/api/game/:gameCode/', (req, res) => {
  const gameCode = req.params.gameCode
  const game = Game.get({ code: gameCode })
  if (game) {
    res.json({ game: Serializer.game(game) })
    return
  }
  res.sendStatus(404)
})

app.post('/api/game/create/', (req, res) => {
  const gameSettings = req.body
  const game = DB.createGame(gameSettings)
  res.json({ game: Serializer.game(game) })
})

app.post('/api/game/join/', (req, res) => {
  const gameCode = req.body.gameCode
  const game = Game.get({ code: gameCode })
  if (game) {
    res.json({ game: Serializer.game(game) })
    return
  }
  res.sendStatus(404)
})

app.post('/api/game/rejoin/', (req, res) => {
  const gameCode = req.body.gameCode
  const userId = req.get('x-user-id')

  const game = Game.get({ code: gameCode })

  if (!game) {
    res.sendStatus(404)
    return
  }
  const user = User.get({ id: userId })

  if (!user || user.gameId !== game.id) {
    res.sendStatus(403)
    return
  }
  res.json({ game: Serializer.game(game) })
})

app.get('*', (req, res) => {
  res.sendFile(
    path.join(__dirname.replace('/src', '') + '/web/build/index.html'),
  )
})

export { app, server, io }
