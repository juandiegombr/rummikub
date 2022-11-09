const { v4 } = require('uuid')

let TILES = {}

function create(params, game) {
  const tile = {
    id: v4(),
    code: params.code,
    value: params.value,
    color: params.color,
    gameId: game.id,
    area: null,
    userId: null,
    spotX: null,
    spotY: null,
  }
  TILES[tile.id] = tile
  return tile
}

function get(query) {
  return Object.values(TILES).find((user) => {
    const queryParams = Object.entries(query)
    return queryParams.every(([key, value]) => {
        return user[key] === value
    })
  })
}

function filter(query) {
  return Object.values(TILES).filter((user) => {
    const queryParams = Object.entries(query)
    return queryParams.every(([key, value]) => {
        return user[key] === value
    })
  })
}

function update(tile, payload) {
  TILES[tile.id] = {...TILES[tile.id], ...payload}
  return TILES[tile.id]
}

function getFirstUnassigned(game) {
  return get({ gameId: game.id, area: null })
}

function getUserTiles(user) {
  return filter({ gameId: user.gameId, userId: user.id })
}

function updateGrid(updatedTiles) {
  updatedTiles.forEach((updatedTile) => {
    const tile = Tile.get({ id: updatedTile.id })
    update(tile, {
      ...updatedTile,
      userId: null,
      area: 'grid'
    })
  })
}

const Tile = {
  create,
  get,
  filter,
  update,
  updateGrid,
  getFirstUnassigned,
  getUserTiles,
  debug: () => {
    console.log('TILES', TILES)
  },
  reset: () => {
    TILES = {}
  }
}

module.exports = { Tile }
