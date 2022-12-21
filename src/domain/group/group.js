import { Tile } from '../tile/index.js'

const areTilesConsecutive = (group) => {
  const areTilesConsecutive = group.reduce(
    ({ previousValue }, tile) => {
      if (Tile.isBonus(tile) || previousValue === 0) {
        return { previousValue: tile.value, result: true }
      }

      const isConsecutive =
        Number.isInteger(previousValue) && previousValue + 1 === tile.value
      if (isConsecutive) {
        return { previousValue: tile.value, result: true }
      }
      return { previousValue: tile.value, result: false }
    },
    { previousValue: null, result: false },
  )

  return areTilesConsecutive.result
}

function allTilesHaveDifferentColors(group) {
  const uniqueColors = new Set(group.map((tile) => tile.color))
  return uniqueColors.size === group.length
}

function getGroupValue(group) {
  return group.find((tile) => tile.value !== 0).value
}

function isSameValue(group) {
  const groupValue = getGroupValue(group)
  return group.every((tile) => tile.value === groupValue || Tile.isBonus(tile))
}

function isSameColor(group) {
  const groupColor = group.find((tile) => tile.color !== 'bonus').color
  return group.every((tile) => tile.color === groupColor || Tile.isBonus(tile))
}

function isValid(group) {
  if (group.length < 3) {
    return false
  }
  if (isSameValue(group) && allTilesHaveDifferentColors(group)) {
    return true
  }
  if (isSameColor(group) && areTilesConsecutive(group)) {
    return true
  }
  return false
}

function value(group) {
  return group.reduce((total, tile, index) => {
    if (Tile.isBonus(tile) && isSameValue(group)) {
      const groupValue = getGroupValue(group)
      return total + groupValue
    }
    if (Tile.isBonus(tile) && isSameColor(group)) {
      if (index === 0) {
        return total + group[index + 1].value
      }
      return total + group[index - 1].value
    }
    return total + tile.value
  }, 0)
}

const Group = {
  isValid,
  value,
}

export { Group }
