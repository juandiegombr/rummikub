const { v4 } = require('uuid')

let TILES = {}

const Tile = {
  create: ({ code, value, color }, game) => {
    const tile = {
      id: v4(),
      code,
      value,
      color,
      gameId: game.id,
      area: null,
      userId: null,
      spotX: null,
      spotY: null,
    }
    TILES[tile.id] = tile
    return tile
  },
  filter: (query) => {
    return Object.values(TILES).filter((user) => {
      const queryParams = Object.entries(query)
      return queryParams.every(([key, value]) => {
          return user[key] === value
      })
    })
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
        area: 'grid'
      }
    })
  },
  getUnassigned: (gameId) => {
    return Object.values(TILES).find((tile) => !tile.userId && tile.gameId === gameId && !tile.spotX && !tile.spotY)
  },
  getUserTiles: (game, userId) => {
    return Object.values(TILES).filter((tile) => tile.gameId === game.id && tile.userId === userId)
  },
  debug: () => {
    console.log('TILES', TILES)
  },
  reset: () => {
    TILES = {}
  }
}

module.exports = { Tile }
