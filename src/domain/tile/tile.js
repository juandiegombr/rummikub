function isBonus(tile) {
  return tile.color === 'bonus' && tile.value === 0
}

function isCommon(tile) {
  return !tile.userId
}

const Tile = {
  isBonus,
  isCommon,
}

export { Tile }
