const { Logger } = require('../../services/logger')
const DB = require('../../db')
const { Brain } = require('../brain')

function initializeSocketService(io) {
  const Socket = {
    getById: (io, socketId) => {
      return io.sockets.sockets.get(socketId)
    },
    getId: (socket) => socket.handshake.auth.token,
    startGame: (socket, gameCode) => {
      const userId = socket.handshake.auth.token
      const game = DB.Game.getByCode(gameCode)
      const playerTiles = DB.getPlayerTiles(game, userId)
      const users = DB.User.filter({ gameId: game.id })
      socket.emit('game:start', { tiles: playerTiles, users })
    },
    startTurn: (gameCode) => {
      const game = DB.Game.getByCode(gameCode)
      const firstPlayer = DB.User.get({ gameId: game.id, order: game.turn })
      const firstPlayerSocket = io.sockets.sockets.get(firstPlayer.socketId)
      firstPlayerSocket.emit('game:turn')
    },
    sendGrid: (socket, gameCode) => {
      const grid = DB.getGrid(gameCode)
      socket.emit('game:move', grid)
    },
    reJoinGame: (socket, gameCode) => {
      const userId = socket.handshake.auth.token
      const game = DB.Game.getByCode(gameCode)
      const playerTiles = DB.getPlayerTiles(game, userId)
      const grid = DB.getGrid(gameCode)
      const user = DB.User.get({ id: userId })
      const users = DB.User.filter({ gameId: game.id })
      socket.emit('game:start', { tiles: playerTiles, users })
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

  const Room = {
    getSockets: async (io, room) => {
      const ids = await io.in(room).allSockets()
      return [...ids].map((id) => {
        return Socket.getById(io, id)
      })
    },
    getPlayers: async (io, room) => {
      const ids = await io.in(room).allSockets()
      return [...ids].map((id) => {
        return Socket.getById(io, id)
      })
    },
    count: async (io, room) => {
      const ids = await io.in(room).allSockets()
      return ids.size
    },
  }

  async function reJoinGame(gameCode, socket) {
    const room = gameCode
    socket.join(room)
    const userId = Socket.getId(socket)
    DB.User.update(userId, { socketId: socket.id })
    Logger.send(`Websocket: User rejoined to the game ${gameCode}`)
  }

  async function joinGame(gameCode, socket) {
    const room = gameCode
    socket.join(gameCode)
    const userId = Socket.getId(socket)
    const user = DB.User.get({ id: userId})
    const game = DB.Game.getByCode(gameCode)
    DB.User.update(userId, { socketId: socket.id })
    DB.joinGame(game, user)
    const playersInRoom = await Room.count(io, room)
    Logger.send(`Websocket: ${playersInRoom} user joined to the game ${gameCode}`)
  }

  io.on('connection', (socket) => {
    Logger.send('Websocket: User connected')

    socket.on('game:join', async ({ data: { gameCode } }) => {
      await joinGame(gameCode, socket)
      const players = await Room.getPlayers(io, gameCode)

      if (players.length === 2) {
        players.forEach((player) => {
          Socket.startGame(player, gameCode)
        })
        Socket.startTurn(gameCode)
      }
    })

    socket.on('game:rejoin', async ({ data: { gameCode } }) => {
      await reJoinGame(gameCode, socket)
      const player = socket
      Socket.reJoinGame(player, gameCode)
    })

    socket.on('game:move', async ({ gameCode, data: move }) => {
      DB.move(gameCode, move)

      const players = await Room.getPlayers(io, gameCode)
      players.forEach(player => {
        Socket.sendGrid(player, gameCode)
      })
    })

    socket.on('game:move:self', async ({ data: tiles }) => {
      tiles.forEach((tile) => {
        DB.Tile.update(tile.id, tile)
      })
    })

    socket.on('game:play', async ({ gameCode, data: newCommonTiles }) => {
      const game = DB.Game.getByCode(gameCode)
      const userId = Socket.getId(socket)
      const user = DB.User.get({ id: userId })
      const userTiles = DB.getPlayerTiles(game, userId)

      if (user.isFirstMove && !Brain.validateFirstMove(newCommonTiles, userTiles)) {
        socket.emit('game:play:ko')
        return
      }

      if (!Brain.validate({ commonTiles: newCommonTiles, userTiles, isFirstMove: user.isFirstMove })) {
        socket.emit('game:play:ko')
        return
      }

      DB.Tile.updateGrid(newCommonTiles)
      DB.User.update(user.id, { isFirstMove: false })
      socket.emit('game:play:ok')
      const players = await Room.getPlayers(io, gameCode)
      players.forEach(player => {
        Socket.sendGrid(player, gameCode)
      })

      const nextPlayer = DB.nextTurn(game)
      const nextPlayerSocket = Socket.getById(io, nextPlayer.socketId)
      nextPlayerSocket.emit('game:turn')
    })

    socket.on('game:pass', async ({ gameCode, data: spot  }) => {
      const game = DB.Game.getByCode(gameCode)
      const userId = Socket.getId(socket)
      const unassignedTile = DB.Tile.getUnassigned(game.id)
      const tile = DB.Tile.update(unassignedTile.id, { userId, spotX: spot.x, spotY: spot.y })
      const tiles = DB.getPlayerTiles(game, userId)
      const grid = DB.getGrid(gameCode)

      socket.emit('game:pass:ok', { tiles, tile, grid })

      const nextPlayer = DB.nextTurn(game)
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
