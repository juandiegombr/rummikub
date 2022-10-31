const { Logger } = require('../../services/logger')
const DB = require('../../db')

function initializeSocketService(io) {
  const Socket = {
    getById: (io, id) => io.sockets.sockets.get(id),
    getId: (socket) => socket.handshake.auth.token,
    startGame: (socket, gameCode) => {
      const userId = socket.handshake.auth.token
      const playerTiles = DB.getPlayerTiles(gameCode, userId)
      socket.emit('game:start', playerTiles)
    },
    sendGrid: (socket, gameCode) => {
      const grid = DB.getGrid(gameCode)
      socket.emit('game:move', grid)
    },
    reJoinGame: (socket, gameCode) => {
      const userId = socket.handshake.auth.token
      const playerTiles = DB.getPlayerTiles(gameCode, userId)
      const grid = DB.getGrid(gameCode)
      socket.emit('game:start', playerTiles)
      socket.emit('game:move', grid)
    },
    move: (socket, gameCode, grid) => {
      const room = Room.getRoom(gameCode)
      socket.to(room).emit('game:move', grid)
    },
  }

  const Room = {
    getSockets: async (io, roomName) => {
      const ids = await io.in(roomName).allSockets()
      return [...ids].map((id) => {
        return Socket.getById(io, id)
      })
    },
    getPlayers: async (io, gameCode) => {
      const roomName = `room:${gameCode}`
      const ids = await io.in(roomName).allSockets()
      return [...ids].map((id) => {
        return Socket.getById(io, id)
      })
    },
    count: async (io, room) => {
      const ids = await io.in(room).allSockets()
      return ids.size
    },
    getGameCode: (room) => {
      return room.split(':')[1]
    },
    getRoom: (gameCode) => {
      return `room:${gameCode}`
    }
  }

  async function reJoinRoom(gameCode, socket) {
    const roomName = `room:${gameCode}`
    socket.join(roomName)
    Logger.send(`Websocket: User rejoined to the game ${gameCode}`)
  }

  async function joinRoom(gameCode, socket) {
    const roomName = `room:${gameCode}`
    socket.join(roomName)
    const playersInRoom = await Room.count(io, roomName)
    Logger.send(`Websocket: ${playersInRoom} user joined to the game ${gameCode}`)
  }

  io.on('connection', (socket) => {
    Logger.send('Websocket: User connected')

    socket.on('game:join', async ({ data: { gameCode } }) => {
      await joinRoom(gameCode, socket)
      const players = await Room.getPlayers(io, gameCode)

      if (players.length === 2) {
        players.forEach((player) => {
          Socket.startGame(player, gameCode)
        })
      }
    })

    socket.on('game:rejoin', async ({ data: { gameCode } }) => {
      await reJoinRoom(gameCode, socket)
      const player = socket
      Socket.reJoinGame(player, gameCode)
    })

    socket.on('game:move', async ({ room, data: move }) => {
      const gameCode = Room.getGameCode(room)
      const userId = Socket.getId(socket)
      const grid = DB.move(gameCode, userId, move)

      const players = await Room.getPlayers(io, gameCode)
      players.forEach(player => {
        Socket.move(player, gameCode, grid)
      })
    })

    socket.on('disconnect', () => {
      socket.broadcast.emit('LEAVED')
      Logger.send('Websocket: User disconnected')
    });
  })
}

module.exports = { initializeSocketService }
