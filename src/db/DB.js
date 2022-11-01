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

function linkUserSocket(userId, socketId) {
  USERS[userId].socketId = socketId
}

function getUser(userId) {
  return USERS[userId]
}

function joinGame(game, user) {
  game.users.push(user.id)
  assignInitialTiles(game, user)
  return game
}

function getGame(gameId) {
  return GAMES[gameId]
}

function getGameByCode(gameCode) {
  return Object.values(GAMES).find((game) => game.code === gameCode)
}

function getPlayerTiles(gameCode, userId) {
  const game = getGameByCode(gameCode)
  const userTiles = Object.values(TILES).filter((tile) => tile.gameId === game.id && tile.userId === userId)
  return userTiles
}

function getGrid(gameCode) {
  const game = getGameByCode(gameCode)
  const tilesInGrid = Object.values(TILES).filter((tile) => tile.gameId === game.id && Number.isInteger(tile.spotX) && Number.isInteger(tile.spotY))
  return tilesInGrid
}

function move(gameCode, move) {
  const game = getGameByCode(gameCode)
  const tileId = move.tile.id
  const tile = TILES[tileId]
  if (tile.gameId !== game.id) {
    Logger.send('Tile is not from game:', { tile, gameCode})
    return
  }
  tile.spotX = move.spot.x
  tile.spotY = move.spot.y
  tile.userId = null
}

function nextTurn(gameCode) {
  const game = getGameByCode(gameCode)
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
  linkUserSocket,
  getUser,
  getGame,
  getGameByCode,
  getGrid,
  getPlayerTiles,
  move,
  nextTurn,
  debug,
  reset,
}
