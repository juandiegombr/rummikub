const { Logger } = require('../../services/logger')
const DB = require('../../db')
const Brain = require('../brain')

function initializeSocketService(io) {
  const Socket = {
    getById: (io, socketId) => {
      return io.sockets.sockets.get(socketId)
    },
    getId: (socket) => socket.handshake.auth.token,
    startGame: (socket, gameCode) => {
      const userId = socket.handshake.auth.token
      const playerTiles = DB.getPlayerTiles(gameCode, userId)
      const users = DB.User.getByGameCode(gameCode)
      socket.emit('game:start', { tiles: playerTiles, users })
    },
    startTurn: (gameCode) => {
      const game = DB.Game.getByCode(gameCode)
      const firstPlayer = DB.User.get(game.turn)
      const firstPlayerSocket = io.sockets.sockets.get(firstPlayer.socketId)
      firstPlayerSocket.emit('game:turn')
    },
    sendGrid: (socket, gameCode) => {
      const grid = DB.getGrid(gameCode)
      socket.emit('game:move', grid)
    },
    reJoinGame: (socket, gameCode) => {
      const userId = socket.handshake.auth.token
      const playerTiles = DB.getPlayerTiles(gameCode, userId)
      const game = DB.Game.getByCode(gameCode)
      const grid = DB.getGrid(gameCode)
      const users = DB.User.getByGameCode(gameCode)
      socket.emit('game:start', { tiles: playerTiles, users })
      socket.emit('game:move', grid)
      const hasTurn = game.turn === userId
      if (hasTurn) {
        socket.emit('game:turn')
      }
    },
    move: (socket, gameCode) => {
      const grid = DB.getGrid(gameCode)
      socket.emit('game:move', grid)
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
    const userId = Socket.getId(socket)
    DB.User.update(userId, { socketId: socket.id })
    Logger.send(`Websocket: User rejoined to the game ${gameCode}`)
  }

  async function joinRoom(gameCode, socket) {
    const roomName = `room:${gameCode}`
    socket.join(roomName)
    const userId = Socket.getId(socket)
    DB.User.update(userId, { socketId: socket.id })
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
        Socket.startTurn(gameCode)
      }
    })

    socket.on('game:rejoin', async ({ data: { gameCode } }) => {
      await reJoinRoom(gameCode, socket)
      const player = socket
      Socket.reJoinGame(player, gameCode)
    })

    socket.on('game:move', async ({ room, data: move }) => {
      const gameCode = Room.getGameCode(room)
      DB.move(gameCode, move)

      const players = await Room.getPlayers(io, gameCode)
      players.forEach(player => {
        Socket.sendGrid(player, gameCode)
      })
    })

    socket.on('game:play', async ({ room, data: grid }) => {
      const gameCode = Room.getGameCode(room)
      const nextPlayer = DB.nextTurn(gameCode)

      if (!Brain.validate(grid)) {
        socket.emit('game:play:ko')
        return
      }

      DB.Tile.updateGrid(grid)
      socket.emit('game:play:ok')
      const players = await Room.getPlayers(io, gameCode)
      players.forEach(player => {
        Socket.sendGrid(player, gameCode)
      })
      const nextPlayerSocket = Socket.getById(io, nextPlayer.socketId)
      nextPlayerSocket.emit('game:turn')
    })

    socket.on('game:pass', async ({ room, data: spot  }) => {
      const gameCode = Room.getGameCode(room)
      const game = DB.Game.getByCode(gameCode)
      const nextPlayer = DB.nextTurn(gameCode)
      const userId = Socket.getId(socket)
      const unassignedTile = DB.Tile.getUnassigned(game.id)
      const tile = DB.Tile.update(unassignedTile.id, { userId, spotX: spot.x, spotY: spot.y })

      socket.emit('game:pass:ok', tile)
      const nextPlayerSocket = Socket.getById(io, nextPlayer.socketId)
      nextPlayerSocket.emit('game:turn')
    })

    socket.on('disconnect', () => {
      socket.broadcast.emit('LEAVED')
      Logger.send('Websocket: User disconnected')
    });
  })
}

module.exports = { initializeSocketService }
