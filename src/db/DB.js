const { v4 } = require('uuid')

const { TileService } = require('../domain/tile')
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
  updateGrid: (grid) => {
    grid.forEach((tile) => {
      TILES[tile.id] = {
        ...TILES[tile.id],
        ...tile,
        userId: null,
      }
    })
  },
  getUnassigned: (gameId) => {
    return Object.values(TILES).find((tile) => !tile.userId && tile.gameId === gameId && !tile.spotX && !tile.spotY)
  }
}

const User = {
  create: ({ name, order = null, gameId = null }) => {
    const user = {
      id: v4(),
      name,
      socketId: null,
      isFirstMove: true,
      gameId,
      order,
    }
    USERS[user.id] = user
    return user
  },
  get: (query) => {
    return Object.values(USERS).find((user) => {
      const queryParams = Object.entries(query)
      return queryParams.every(([key, value]) => {
          return user[key] === value
      })
    })
  },
  getByGameCode: (gameCode) => {
    const game = Game.getByCode(gameCode)
    const userIds = game.users
    return userIds.map((userId) => USERS[userId])
  },
  filter: (query) => {
    return Object.values(USERS).filter((user) => {
      const queryParams = Object.entries(query)
      return queryParams.every(([key, value]) => {
          return user[key] === value
      })
    })
  },
  update: (userId, payload) => {
    USERS[userId] = {...USERS[userId], ...payload}
    return USERS[userId]
  }
}

const Game = {
  create: () => {
    const game = {
      id: v4(),
      code: generateGameCode(),
      turn: 0
    }
    GAMES[game.id] = game
    return game
  },
  get: (gameId) => {
    GAMES[gameId]
  },
  getByCode: (gameCode) => {
    return Object.values(GAMES).find((game) => game.code === gameCode)
  },
  update: (game, payload) => {
    GAMES[game.id] = {...GAMES[game.id], ...payload}
    return GAMES[game.id]
  },
}

function createTiles(game) {
  const tiles = TileService.generateTiles()
  const shuffledTiles = TileService.shuffle(tiles).map((tile) => Tile.create(tile, game))
  return shuffledTiles
}

function assignInitialTiles(game, user) {
  const unassignedTiles = Object.values(TILES).filter((tile) => tile.gameId === game.id && tile.userId === null)
  const tilesToAssign = unassignedTiles.splice(0, 14)
  const userSpots = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
    { x: 4, y: 0 },
    { x: 5, y: 0 },
    { x: 6, y: 0 },
    { x: 7, y: 0 },
    { x: 8, y: 0 },
    { x: 9, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 3, y: 1 },
  ]
  tilesToAssign.forEach((tile, index) => {
    tile.userId = user.id
    const spot = userSpots[index]
    tile.spotX = spot.x
    tile.spotY = spot.y
  })
}

function createGame(user) {
  const game = Game.create(user)
  createTiles(game)
  return game
}

function joinGame(game, user) {
  const usersInGame = User.filter({ gameId: game.id })
  const order = usersInGame.length
  User.update(user.id, { gameId: game.id, order })
  assignInitialTiles(game, user)
  return game
}

function getPlayerTiles(game, userId) {
  const userTiles = Object.values(TILES).filter((tile) => tile.gameId === game.id && tile.userId === userId)
  return userTiles
}

function getGrid(gameCode) {
  const game = Game.getByCode(gameCode)
  const tilesInGrid = Object.values(TILES).filter((tile) => (
    tile.gameId === game.id
    && Number.isInteger(tile.spotX)
    && Number.isInteger(tile.spotY)
    && !tile.userId
  ))
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

function nextTurn(game) {
  const usersInGame = User.filter({ gameId: game.id })
  const currentUser = User.get({ gameId: game.id, order: game.turn })
  const isLast = usersInGame.length === currentUser.order + 1
  if (isLast) {
    const nextUserPosition = 0
    const nextUser = User.get({ gameId: game.id, order: nextUserPosition })
    game.turn = nextUserPosition
    return USERS[nextUser.id]
  }
  const nextUserPosition = currentUser.order + 1
  const nextUser = User.get({ gameId: game.id, order: nextUserPosition })
  game.turn = nextUserPosition
  return USERS[nextUser.id]
}

function debug() {
  console.log({
    GAMES,
    USERS,
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
