import { TileService } from '../domain/tile/index.js'
import { Game, Tile, User } from '../models/index.js'

function createGame(gameSettings) {
  const game = Game.create(gameSettings)
  createTiles(game)
  return game
}

function createTiles(game) {
  const gameTiles = Tile.filter({ gameId: game.id })
  gameTiles.forEach(Tile.remove)
  const tiles = TileService.generateTiles()
  const shuffledTiles = TileService.shuffle(tiles).map((tile) =>
    Tile.create({ ...tile, game }),
  )
  return shuffledTiles
}

function getGrid(gameCode) {
  const game = Game.get({ code: gameCode })
  return Tile.filter({ gameId: game.id, area: 'grid' })
}

function move(gameCode, move) {
  const tileId = move.tile.id
  const tile = Tile.get({ id: tileId })
  Tile.update(tile, {
    spotX: move.spot.x,
    spotY: move.spot.y,
    userId: null,
  })
}

function nextTurn(game) {
  const currentUser = User.get({ gameId: game.id, order: game.turn })
  const isLast = game.users.length === currentUser.order + 1
  if (isLast) {
    const nextUserPosition = 0
    const nextUser = User.get({ gameId: game.id, order: nextUserPosition })
    Game.update(game, { turn: nextUserPosition })
    return User.get({ id: nextUser.id })
  }
  const nextUserPosition = currentUser.order + 1
  const nextUser = User.get({ gameId: game.id, order: nextUserPosition })
  Game.update(game, { turn: nextUserPosition })
  return User.get({ id: nextUser.id })
}

function debug() {
  Game.debug()
  User.debug()
}

function reset() {
  const env = process.env.NODE_ENV
  if (env !== 'test') return

  Game.reset()
  Tile.reset()
  User.reset()
}

function createDebugGame() {
  const env = process.env.NODE_ENV
  if (env === 'test') return
  const game = Game.create({ code: 'AAAA' })
  TileService.generateTiles()
    .reverse()
    .map((tile) => Tile.create({ ...tile, game }))
}

createDebugGame()

export {
  User,
  Game,
  Tile,
  createGame,
  createTiles,
  getGrid,
  move,
  nextTurn,
  debug,
  reset,
}
