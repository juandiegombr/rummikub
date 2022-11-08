const { Logger } = require('../services/logger')
const DB = require('../db')
const { Game, Tile, User } = require('../models')
const { Socket } = require('../services/socket')
const { play } = require('../actions/play')
const { join } = require('../actions/join')

function initializeSocketService(io) {
  Socket.init(io)

  async function reJoinGame(gameCode, socket) {
    const room = gameCode
    socket.join(room)
    const userId = Socket.getId(socket)
    const user = User.get({ id: userId })
    User.update(user, { socketId: socket.id })
    Logger.send(`Websocket: User rejoined to the game ${gameCode}`)
  }

  async function joinGame(gameCode, socket) {
    const room = gameCode
    socket.join(gameCode)
    const userId = Socket.getId(socket)
    const user = User.get({ id: userId })
    const game = Game.getByCode(gameCode)
    User.update(user, { socketId: socket.id })
    DB.joinGame(game, user)
    const playersInRoom = await Socket.countClients(room)
    Logger.send(`Websocket: ${playersInRoom} user joined to the game ${gameCode}`)
  }

  io.on('connection', (socket) => {
    Logger.send('Websocket: User connected')

    socket.on('game:join', async ({ data: { gameCode } }) => {
      await join.execute({ socket, gameCode })
    })

    socket.on('game:rejoin', async ({ data: { gameCode } }) => {
      await reJoinGame(gameCode, socket)
      const client = socket
      Socket.reJoinGame(client, gameCode)
    })

    socket.on('game:move', async ({ gameCode, data: move }) => {
      DB.move(gameCode, move)
      const clients = await Socket.getClientsFromRoom(gameCode)
      clients.forEach(client => {
        const grid = DB.getGrid(gameCode)
        client.emit('game:move', grid)
      })
    })

    socket.on('game:move:self', async ({ data: updatedTiles }) => {
      updatedTiles.forEach((updatedTile) => {
        const tile = Tile.get({ id: updatedTile.id })
        Tile.update(tile, updatedTile)
      })
    })

    socket.on('game:play', async ({ gameCode, data }) => {
      await play.execute({ socket, gameCode, data })
    })

    socket.on('game:pass', async ({ gameCode, data: spot  }) => {
      const userId = Socket.getId(socket)
      const user = User.get({ id: userId })
      const game = Game.getByCode(gameCode)
      const unassignedTile = Tile.getFirstUnassigned(game)
      const tile = Tile.update(unassignedTile, { area: 'player', userId, spotX: spot.x, spotY: spot.y })
      const tiles = Tile.getUserTiles(game, user)
      const grid = DB.getGrid(gameCode)

      socket.emit('game:pass:ok', { tiles, tile, grid })

      const nextPlayer = DB.nextTurn(game)
      const nextPlayerSocket = Socket.getById(nextPlayer.socketId)
      nextPlayerSocket.emit('game:turn')
    })

    socket.on('disconnect', () => {
      socket.broadcast.emit('LEAVED')
      Logger.send('Websocket: User disconnected')
    });
  })
}

module.exports = { initializeSocketService }
