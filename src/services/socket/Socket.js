const DB = require('../../db')
const { Game, Tile, User } = require('../../models')
const { Serializer } = require('../../serializer')

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
      client.emit('game:start', user.tiles.map(Serializer.tile))
    })
  },
  updateGameStatus: async (game) => {
    const remainingTiles = Tile.filter({ gameId: game.id, area: null })
    const clients = await Socket.getClientsFromRoom(game.code)
    clients.forEach(client => {
      client.emit('game:summary', {
        users: game.users.map(Serializer.userSummary),
        remainingTiles: remainingTiles.length,
      })
    })
  },
  startTurn: (gameCode) => {
    const game = Game.get({ code: gameCode })
    const firstPlayer = User.get({ gameId: game.id, order: game.turn })
    const firstPlayerSocket = getById(firstPlayer.socketId)
    firstPlayerSocket.emit('game:turn')
  },
  reJoinGame: (socket, gameCode) => {
    const userId = socket.handshake.auth.token
    const user = User.get({ id: userId })
    const game = Game.get({ code: gameCode })
    const grid = DB.getGrid(gameCode)
    const remainingTiles = Tile.filter({ gameId: game.id, area: null })
    socket.emit('game:start', user.tiles.map(Serializer.tile))
    socket.emit('game:summary', {
      users: game.users.map(Serializer.userSummary),
      remainingTiles: remainingTiles.length,
    })
    socket.emit('game:move', grid.map(Serializer.tile))
    const hasTurn = game.turn === user.order
    if (hasTurn) {
      socket.emit('game:turn')
    }
  },
  move: (socket, gameCode) => {
    const grid = DB.getGrid(gameCode)
    socket.emit('game:move', grid.map(Serializer.tile))
  },
}

module.exports = { Socket }
