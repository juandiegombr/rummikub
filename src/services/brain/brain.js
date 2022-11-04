const { Grid } = require('../../domain/grid')
const { Group } = require('../../domain/group')

function hasSomeTilesFromPlayer(grid, playerTiles) {
  const gridTileIds = grid.map((tile) => tile.id)
  return playerTiles.some((tile) => gridTileIds.includes(tile.id))
}

function validate(grid, playerTiles = []) {
  if (Grid.isEmpty(grid)) {
    return false
  }

  if (!hasSomeTilesFromPlayer(grid, playerTiles)) return false

  const groups = Grid.getGroups(grid)
  return groups.every(Group.isValid)
}

const Brain = {
  validate,
}

module.exports = { Brain }
