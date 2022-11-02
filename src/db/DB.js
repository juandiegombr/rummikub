const { v4 } = require('uuid')

const TileService = require('../domain/tile')
const { generateGameCode } = require('../helpers')
const { Logger } = require('../services/logger')

let GAMES = {}
let USERS = {}
let TILES = {}

const Tile = {
  create: ({ code, value, color }, game) => {
    const tile = {
      id: v4(),
      code,
      value,
      color,
      gameId: game.id,
      userId: null,
      spotX: null,
      spotY: null,
    }
    TILES[tile.id] = tile
    return tile
  },
  update: (tileId, payload) => {
    TILES[tileId] = {...TILES[tileId], ...payload}
    return TILES[tileId]
  },
  getUnassigned: (gameId) => {
    return Object.values(TILES).find((tile) => !tile.userId && tile.gameId === gameId && !tile.spotX && !tile.spotY)
  }
}

const User = {
  create: () => {
    const user = {
      id: v4(),
      name: null,
      socketId: null,
    }
    USERS[user.id] = user
    return user
  },
  get: (userId) => {
    return USERS[userId]
  },
  update: (userId, payload) => {
    USERS[userId] = {...USERS[userId], ...payload}
    return USERS[userId]
  }
}

const Game = {
  create: (user) => {
    const game = {
      id: v4(),
      code: generateGameCode(),
      users: [user.id],
      turn: user.id
    }
    GAMES[game.id] = game
    return game
  },
  get: (gameId) => {
    GAMES[gameId]
  },
  getByCode: (gameCode) => {
    return Object.values(GAMES).find((game) => game.code === gameCode)
  }
}

function createTiles(game) {
  const tiles = TileService.generateTiles()
  const shuffledTiles = TileService.shuffle(tiles).map((tile) => Tile.create(tile, game))
  return shuffledTiles
}

function assignInitialTiles(game, user) {
  const unassignedTiles = Object.values(TILES).filter((tile) => tile.gameId === game.id && tile.userId === null)
  const tilesToAssign = unassignedTiles.splice(0, 14)
  tilesToAssign.forEach(tile => {
    tile = tile.userId = user.id
  })
}

function createGame(user) {
  const game = Game.create(user)
  createTiles(game)
  assignInitialTiles(game, user)
  return game
}

function joinGame(game, user) {
  game.users.push(user.id)
  assignInitialTiles(game, user)
  return game
}

function getPlayerTiles(gameCode, userId) {
  const game = Game.getByCode(gameCode)
  const userTiles = Object.values(TILES).filter((tile) => tile.gameId === game.id && tile.userId === userId)
  return userTiles
}

function getGrid(gameCode) {
  const game = Game.getByCode(gameCode)
  const tilesInGrid = Object.values(TILES).filter((tile) => tile.gameId === game.id && Number.isInteger(tile.spotX) && Number.isInteger(tile.spotY))
  return tilesInGrid
}

function move(gameCode, move) {
  const game = Game.getByCode(gameCode)
  const tileId = move.tile.id
  const tile = TILES[tileId]
  if (tile.gameId !== game.id) {
    Logger.send('Tile is not from game:', { tile, gameCode})
    return
  }
  Tile.update(tileId, {
    spotX: move.spot.x,
    spotY: move.spot.y,
    userId: null,
  })
}

function nextTurn(gameCode) {
  const game = Game.getByCode(gameCode)
  const currentUserId = game.turn
  const currentUserIdPosition = game.users.findIndex((userId) => userId === currentUserId)
  const isLast = game.users.length === currentUserIdPosition + 1
  if (isLast) {
    const nextUserIdPosition = 0
    const nextUserId = game.users[nextUserIdPosition]
    game.turn = nextUserId
    return USERS[nextUserId]
  }
  const nextUserIdPosition = currentUserIdPosition + 1
  const nextUserId = game.users[nextUserIdPosition]
  game.turn = nextUserId
  return USERS[nextUserId]
}

function debug() {
  console.log({
    GAMES,
    USERS,
    TILES,
  })
}

function reset() {
  const env = process.env.NODE_ENV
  if (env !== 'test') return

  GAMES = {}
  USERS = {}
  TILES = {}
}

module.exports = {
  User,
  Game,
  Tile,
  createGame,
  joinGame,
  getGrid,
  getPlayerTiles,
  move,
  nextTurn,
  debug,
  reset,
}
