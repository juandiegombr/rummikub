function isBonus(tile) {
  return tile.color === 'bonus' && tile.value === 0
}

const Tile = {
  isBonus,
}

module.exports = { Tile }
