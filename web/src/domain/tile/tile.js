const COLORS = ['red', 'blue', 'orange', 'black']

const generateTiles = () => {
  const tiles = COLORS.map((color) => {
    return Array.from({ length: 13 }).map((_, index) => ({
      id: `id_${color}_${index + 1}`,
      value: index + 1,
      color,
    }))
  })
  return tiles.reduce((acc, colorTiles) => acc.concat(colorTiles), [])
}

const shuffle = (originalTiles) => {
  let tiles = originalTiles.slice()
  for (let i = tiles.length - 1; i >= 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1))
    const randomCard = tiles[randomIndex]
    tiles[randomIndex] = tiles[i]
    tiles[i] = randomCard
  }
  return tiles
}

export const TileService = {
  generateTiles,
  shuffle,
}