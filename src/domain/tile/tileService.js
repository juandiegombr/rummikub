const { Tile } = require("./tile")

const COLORS = ['red', 'blue', 'orange', 'black']
const TILES_FOR_BRAND = 13

const generateTile = (value, color) => {
  return {
    code: `id_${color}_${value}`,
    value,
    color,
  }
}

const generateTiles = () => {
  const bonusTiles = [generateTile(0, 'bonus'), generateTile(0, 'bonus')]
  const tiles = COLORS.map((color) => {
    return Array
      .from({ length: TILES_FOR_BRAND })
      .map((_, index) => generateTile(index + 1, color))
  })
  return [...bonusTiles, ...tiles ].reduce((acc, colorTiles) => acc.concat(colorTiles), [])
}

const shuffle = (tiles) => {
  let shuffledTiles = tiles.slice()
  for (let i = shuffledTiles.length - 1; i >= 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1))
    const randomCard = shuffledTiles[randomIndex]
    shuffledTiles[randomIndex] = shuffledTiles[i]
    shuffledTiles[i] = randomCard
  }
  return shuffledTiles
}

const getScore = (tiles) => {
  return tiles.reduce((total, tile) => {
    if (Tile.isBonus(tile)) {
      return total + 30
    }
    return total + tile.value
  }, 0)
}

const TileService = {
  generateTiles,
  shuffle,
  getScore,
}

module.exports = { TileService }
