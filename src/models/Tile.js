const { v4 } = require('uuid')

const { Game } = require('./Game')
const { User } = require('./User')

let TILES = {}

Game.modelRelations.push({
  name: 'tiles',
  func: (game) => filter({ gameId: game.id })
})

User.modelRelations.push({
  name: 'tiles',
  func: (user) => filter({ userId: user.id })
})

function TileModel(data) {
  const tile = JSON.parse(JSON.stringify(data))
  Object.defineProperty(tile,
    'user',
    {
      enumerable: true,
      configurable: true,
      get() {
        const freshTile = TILES[this.id]
        if (freshTile.userId) {
          return User.get({ id: freshTile.userId })
        }
      },
    }
  )
  Object.defineProperty(tile,
    'game',
    {
      enumerable: true,
      configurable: true,
      get() {
        const freshTile = TILES[this.id]
        if (freshTile.gameId) {
          return Game.get({ id: freshTile.gameId })
        }
      },
    }
  )
  return tile
}

function create(params) {
  const tile = {
    id: v4(),
    code: params.code,
    value: params.value,
    color: params.color,
    gameId: params.game ? params.game.id : null,
    area: null,
    userId: null,
    spotX: null,
    spotY: null,
  }
  TILES[tile.id] = tile
  return TileModel(tile)
}

function remove(tile) {
  delete TILES[tile.id]
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
  remove,
  get,
  filter,
  update,
  updateGrid,
  debug: () => {
    console.log('TILES', TILES)
  },
  reset: () => {
    TILES = {}
  }
}

module.exports = { Tile }
