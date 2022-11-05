const { Grid } = require('../../domain/grid')
const { Group } = require('../../domain/group')

function count(commonTiles) {
  const groups = Grid.getGroups(commonTiles)
  const groupValues = groups.map(Group.value)
  return groupValues.reduce((total, groupValue) => {
    return total + groupValue
  }, 0)
}

function hasSomeTilesFromPlayer({ commonTiles, userTiles }) {
  const commonTileIds = commonTiles.map((tile) => tile.id)
  return userTiles.some((tile) => commonTileIds.includes(tile.id))
}

function validate({ commonTiles, userTiles = [], isFirstMove }) {
  if (isFirstMove) {
    return validateCommonTilesInFirstMove({ commonTiles, userTiles })
  }

  return validateCommonTiles({ commonTiles, userTiles })
}

function validateCommonTilesInFirstMove({ commonTiles, userTiles = [] }) {
  const commonTilesFromPlayer = commonTiles.filter((tile) => {
    const playerTileIds = userTiles.map((tile) => tile.id)
    return playerTileIds.includes(tile.id)
  })

  if (count(commonTilesFromPlayer) < 30) {
    return false
  }

  return validateCommonTiles({ commonTiles, userTiles })
}

function validateCommonTiles({ commonTiles, userTiles = [] }) {
  if (Grid.isEmpty(commonTiles)) {
    return false
  }

  if (!hasSomeTilesFromPlayer({ commonTiles, userTiles })) return false

  const groups = Grid.getGroups(commonTiles)
  return groups.every(Group.isValid)
}

const Brain = {
  validate,
}

module.exports = { Brain }
