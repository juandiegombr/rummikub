const { Tile } = require("../tile")

const areTilesConsecutive = (group) => {
  const areTilesConsecutive = group.reduce(({previousValue}, tile) => {
    const isConsecutive = previousValue && previousValue + 1 === tile.value || Tile.isBonus(tile)
    if (isConsecutive) {
      return { previousValue: tile.value, result: true }
    }
    return { previousValue: tile.value, result: false }
  }, { previousValue: null, result: false})

  return areTilesConsecutive.result
}

function isValid(group) {
  if (group.length < 3) {
    return false
  }
  const groupValue = group.find((tile) => tile.value !== 0).value
  const haveSameValue = group.every((tile) => tile.value === groupValue || Tile.isBonus(tile))
  const uniqueColors = new Set(group.map((tile) => tile.color))
  const allTilesHaveDifferentColors = uniqueColors.size === group.length
  if (haveSameValue && allTilesHaveDifferentColors) {
    return true
  }
  const groupColor = group.find((tile) => tile.color !== 'bonus').color
  const haveSameColor = group.every((tile) => tile.color === groupColor || Tile.isBonus(tile))
  if (haveSameColor && areTilesConsecutive(group)) {
    return true
  }
  return false
}

const Group = {
  isValid,
}

module.exports = { Group }
