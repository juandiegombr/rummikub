import { Grid } from '../../domain/grid/index.js'
import { Group } from '../../domain/group/index.js'

function count(tiles) {
  const groups = Grid.getGroups(tiles)
  const groupValues = groups.map(Group.value)
  return groupValues.reduce((total, groupValue) => {
    return total + groupValue
  }, 0)
}

function hasSomeTilesFromPlayer({ newCommonTiles, userTiles }) {
  const newCommonTileIds = newCommonTiles.map((tile) => tile.id)
  return userTiles.some((tile) => newCommonTileIds.includes(tile.id))
}

function validate({
  commonTiles = [],
  newCommonTiles,
  userTiles = [],
  isFirstMove,
}) {
  if (isFirstMove) {
    return validateCommonTilesInFirstMove({ newCommonTiles, userTiles })
  }

  return validateCommonTiles({ commonTiles, newCommonTiles, userTiles })
}

function validateCommonTilesInFirstMove({ newCommonTiles, userTiles = [] }) {
  const newCommonTilesFromPlayer = newCommonTiles.filter((tile) => {
    const playerTileIds = userTiles.map((tile) => tile.id)
    return playerTileIds.includes(tile.id)
  })

  if (count(newCommonTilesFromPlayer) < 30) {
    return false
  }

  return validateCommonTiles({ newCommonTiles, userTiles })
}

function hasMissingCommonTiles({ commonTiles, newCommonTiles }) {
  const newCommonTileIds = newCommonTiles.map((tile) => tile.id)
  return !commonTiles.every((tile) => newCommonTileIds.includes(tile.id))
}

function validateCommonTiles({
  commonTiles = [],
  newCommonTiles,
  userTiles = [],
}) {
  if (Grid.isEmpty(newCommonTiles)) {
    return false
  }

  if (hasMissingCommonTiles({ commonTiles, newCommonTiles })) {
    return false
  }

  if (!hasSomeTilesFromPlayer({ newCommonTiles, userTiles })) return false

  const groups = Grid.getGroups(newCommonTiles)
  return groups.every(Group.isValid)
}

const Brain = {
  validate,
}

export { Brain }
