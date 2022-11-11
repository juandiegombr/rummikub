const DB = require('../db')
const { Game, User } = require("../models")
const { Logger } = require('../services/logger')
const { Socket } = require('../services/socket')

async function execute({ socket, gameCode }) {
  const room = gameCode
  socket.join(gameCode)
  const userId = Socket.getId(socket)
  const user = User.get({ id: userId })
  const game = Game.getByCode(gameCode)
  User.update(user, { socketId: socket.id })
  DB.joinGame(game, user)
  const playersInRoom = await Socket.countClients(room)

  Logger.send(`Websocket: ${playersInRoom} user joined to the game ${gameCode}`)

  const clients = await Socket.getClientsFromRoom(gameCode)
  if (clients.length === game.players) {
    Socket.startGame(game)
    Socket.updateGameStatus(game)
    Socket.startTurn(gameCode)
  }
}

const join = {
  execute,
}

module.exports = { join }