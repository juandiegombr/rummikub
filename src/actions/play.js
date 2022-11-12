const DB = require('../db')
const { Game, User, Tile } = require("../models")
const { Round } = require('../models/Round')
const { Brain } = require('../services/brain')
const { Socket } = require('../services/socket')

async function execute({ socket, gameCode, data: newCommonTiles }) {
  const game = Game.getByCode(gameCode)
  const userId = Socket.getId(socket)
  const user = User.get({ id: userId })
  const userTiles = Tile.getUserTiles(user)
  const commonTiles = DB.getGrid(gameCode)

  const isValid = Brain.validate({
    newCommonTiles,
    commonTiles,
    userTiles,
    isFirstMove: user.isFirstMove,
  })

  if (!isValid) {
    return sendInvalidPlay({ socket })
  }

  User.update(user, { isFirstMove: false })
  Tile.updateGrid(newCommonTiles)

  const hasFinished = Tile.getUserTiles(user).length === 0
  if (hasFinished) {
    return finishRound({ socket, gameCode })
  }

  sendValidPlay({ socket })

  const nextPlayer = DB.nextTurn(game)
  const nextPlayerSocket = Socket.getById(nextPlayer.socketId)
  nextPlayerSocket.emit('game:turn')

  const clients = await Socket.getClientsFromRoom(gameCode)
  const grid = DB.getGrid(gameCode)
  clients.forEach(client => {
    client.emit('game:move', grid)
  })
  Socket.updateGameStatus(game)
}

function sendValidPlay({ socket }) {
  socket.emit('game:play:ok')
}

function sendInvalidPlay({ socket }) {
  socket.emit('game:play:ko')
}

function prepareNewRound(game) {
  DB.createTiles(game)
  Game.update(game, { rounds: game.rounds + 1})
  const users = User.filter({ gameId: game.id })
  users.forEach(user => {
    User.update(user, { isFirstMove: true })
  })
}

async function finishRound({ socket, gameCode }) {
  const game = Game.getByCode(gameCode)
  Round.createForGame(game)
  const clients = await Socket.getClientsFromRoom(gameCode)
  const grid = DB.getGrid(gameCode)
  const rounds = Round.getForGame(game)
  clients.forEach(client => {
    client.emit('game:move', grid)
    client.emit('game:finish', rounds)
  })
  socket.emit('game:win')
  prepareNewRound(game)
}

const play = {
  execute,
}

module.exports = { play }