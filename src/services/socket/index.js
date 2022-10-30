const { Logger } = require('../../services/logger')
const TileService = require('../../domain/tile')
const { generateGameCode } = require('../../helpers')
const { GAMES } = require('../../db')

function initializeSocketService(io) {
  const Socket = {
    getById: (io, id) => io.sockets.sockets.get(id)
  }

  const Room = {
    getSockets: async (io, room) => {
      const ids = await io.in(room).allSockets()
      return [...ids].map((id) => {
        return Socket.getById(io, id)
      })
    }
  }

  function splitTiles(game) {
    const gameTiles = GAMES[game.code].tiles
    return [gameTiles.slice(0, 14), gameTiles.slice(14, 28)]
  }

  async function joinRoom(game, socket) {
    const roomName = `room:${game.code}`
    socket.join(roomName)
    const socketsInRoom = await Room.getSockets(io, roomName)
    Logger.send(`Websocket: ${socketsInRoom.length} user joined to the game ${game.code}`)
    return socketsInRoom
  }

  async function afterUserJoined(game, socket) {
    const socketsInRoom = await joinRoom(game, socket)

    if (socketsInRoom.length === 2) {
      const playersTiles = splitTiles(game)
      socketsInRoom.forEach((playerSocket, index) => {
        playerSocket.emit('game:start', playersTiles[index])
      })
    }
  }

  io.on('connection', (socket) => {
    Logger.send('Websocket: User connected', socket.id)

    socket.on('game:join', async ({ data: game }) => {
      await afterUserJoined(game, socket)
    })

    socket.on('game:move', async ({ room, data: move }) => {
      const code = room.split(':')[1]
      const game = GAMES[code]
      game.grid = {...game.grid, [move.tile.id]: move}
      const socketsInRoom = await Room.getSockets(io, room)
      socketsInRoom.forEach(socket => {
        socket.to(room).emit('game:move', game.grid)
      })
    })

    socket.on('disconnect', () => {
      socket.broadcast.emit('LEAVED')
      Logger.send('Websocket: User disconnected')
    });
  })
}

module.exports = { initializeSocketService }
