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
  startGame: async (game) => {
    const clients = await Socket.getClientsFromRoom(game.code)
    clients.forEach(client => {
      const userId = getId(client)
      const user = User.get({ id: userId })
      const userTiles = Tile.getUserTiles(user)
      client.emit('game:start', userTiles)
    })
  },
  updateGameStatus: async (game) => {
    const users = User.filterForClient({ gameId: game.id })
    const remainingTiles = Tile.filterUnassigned(game)
    const clients = await Socket.getClientsFromRoom(game.code)
    clients.forEach(client => {
      client.emit('game:summary', { users, remainingTiles: remainingTiles.length })
    })
  },
  startTurn: (gameCode) => {
    const game = Game.getByCode(gameCode)
    const firstPlayer = User.get({ gameId: game.id, order: game.turn })
    const firstPlayerSocket = getById(firstPlayer.socketId)
    firstPlayerSocket.emit('game:turn')
  },
  reJoinGame: (socket, gameCode) => {
    const userId = socket.handshake.auth.token
    const user = User.get({ id: userId })
    const game = Game.getByCode(gameCode)
    const userTiles = Tile.getUserTiles(user)
    const grid = DB.getGrid(gameCode)
    const users = User.filterForClient({ gameId: game.id })
    const remainingTiles = Tile.filterUnassigned(game)
    socket.emit('game:start', userTiles)
    socket.emit('game:summary', { users, remainingTiles: remainingTiles.length })
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
