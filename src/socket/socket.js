import { join } from '../actions/join.js'
import { play } from '../actions/play.js'
import { roundStart } from '../actions/roundStart.js'
import DB from '../db/index.js'
import { Game, Tile, User } from '../models/index.js'
import { Serializer } from '../serializer/index.js'
import { Logger } from '../services/logger/index.js'
import { Socket } from '../services/socket/index.js'

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

  io.on('connection', (socket) => {
    Logger.send('Websocket: User connected')

    socket.on('game:join', async ({ data: { gameCode } }) => {
      await join.execute({ socket, gameCode })
    })

    socket.on('game:round:confirm', async ({ gameCode }) => {
      await roundStart.execute({ socket, gameCode })
    })

    socket.on('game:rejoin', async ({ data: { gameCode } }) => {
      await reJoinGame(gameCode, socket)
      const client = socket
      Socket.reJoinGame(client, gameCode)
    })

    socket.on('game:move', async ({ gameCode, data: move }) => {
      DB.move(gameCode, move)
      const clients = await Socket.getClientsFromRoom(gameCode)
      clients.forEach((client) => {
        const grid = DB.getGrid(gameCode)
        client.emit('game:move', grid.map(Serializer.tile))
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

    socket.on('game:pass', async ({ gameCode, data: spot }) => {
      const userId = Socket.getId(socket)
      const user = User.get({ id: userId })
      const game = Game.get({ code: gameCode })
      const unassignedTile = Tile.get({ gameId: game.id, area: null })
      const tile = Tile.update(unassignedTile, {
        area: 'player',
        userId,
        spotX: spot.x,
        spotY: spot.y,
      })
      const grid = DB.getGrid(gameCode)

      socket.emit('game:pass:ok', { tiles: user.tiles, tile, grid })

      const nextPlayer = DB.nextTurn(game)
      const nextPlayerSocket = Socket.getById(nextPlayer.socketId)
      nextPlayerSocket.emit('game:turn')
      Socket.updateGameStatus(game)
    })

    socket.on('disconnect', () => {
      socket.broadcast.emit('LEAVED')
      Logger.send('Websocket: User disconnected')
    })
  })
}

export { initializeSocketService }
