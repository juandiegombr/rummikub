const { Logger } = require('../../services/logger')
const DB = require('../../db')

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

  async function joinRoom(gameCode, socket) {
    const roomName = `room:${gameCode}`
    socket.join(roomName)
    const socketsInRoom = await Room.getSockets(io, roomName)
    Logger.send(`Websocket: ${socketsInRoom.length} user joined to the game ${gameCode}`)
    return socketsInRoom
  }

  async function afterUserJoined(gameCode, socket) {
    const socketsInRoom = await joinRoom(gameCode, socket)

    if (socketsInRoom.length === 2) {
      socketsInRoom.forEach((playerSocket) => {
        const userId = playerSocket.handshake.auth.token
        const gameData = DB.getGames()[gameCode]
        playerSocket.emit('game:start', gameData.players[userId])
      })
    }
  }

  io.on('connection', (socket) => {
    Logger.send('Websocket: User connected')

    socket.on('game:join', async ({ data: { gameCode } }) => {
      await afterUserJoined(gameCode, socket)
    })

    socket.on('game:move', async ({ room, data: move }) => {
      const code = room.split(':')[1]
      const game = DB.getGames()[code]
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
