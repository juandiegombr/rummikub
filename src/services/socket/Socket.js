const DB = require('../../db')
const { Game, Tile, User } = require('../../models')

let io = null

function init(instance) {
  return io = instance
}

function getById(socketId) {
  return io.sockets.sockets.get(socketId)
}

function getId(socket) {
  return socket.handshake.auth.token
}

async function getClientsFromRoom(room) {
  const ids = await io.in(room).allSockets()
  return [...ids].map((id) => {
    return Socket.getById(id)
  })
}

async function countClients(room) {
  const ids = await io.in(room).allSockets()
  return ids.size
}

const Socket = {
  init,
  getById,
  getId,
  getClientsFromRoom,
  countClients,
  startGame: (socket, gameCode) => {
    const userId = socket.handshake.auth.token
    const user = User.get({ id: userId })
    const game = Game.getByCode(gameCode)
    const userTiles = Tile.getUserTiles(game, user)
    const users = User.filter({ gameId: game.id })
    socket.emit('game:start', { tiles: userTiles, users })
  },
  startTurn: (gameCode) => {
    const game = Game.getByCode(gameCode)
    const firstPlayer = User.get({ gameId: game.id, order: game.turn })
    const firstPlayerSocket = getById(firstPlayer.socketId)
    firstPlayerSocket.emit('game:turn')
  },
  sendGrid: (socket, gameCode) => {
    const grid = DB.getGrid(gameCode)
    socket.emit('game:move', grid)
  },
  reJoinGame: (socket, gameCode) => {
    const userId = socket.handshake.auth.token
    const user = User.get({ id: userId })
    const game = Game.getByCode(gameCode)
    const userTiles = Tile.getUserTiles(game, user)
    const grid = DB.getGrid(gameCode)
    const users = User.filter({ gameId: game.id })
    socket.emit('game:start', { tiles: userTiles, users })
    socket.emit('game:move', grid)
    const hasTurn = game.turn === user.order
    if (hasTurn) {
      socket.emit('game:turn')
    }
  },
  move: (socket, gameCode) => {
    const grid = DB.getGrid(gameCode)
    socket.emit('game:move', grid)
  },
}

module.exports = { Socket }
