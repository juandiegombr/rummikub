const { Grid } = require('../../domain/grid')
const { Group } = require('../../domain/group')

function validate(grid) {
  if (Grid.isEmpty(grid)) {
    return false
  }
  const groups = Grid.getGroups(grid)
  return groups.every(Group.isValid)
}

const Brain = {
  validate,
}

module.exports = { Brain }
