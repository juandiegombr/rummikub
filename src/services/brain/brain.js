const Grid = {
  isEmpty: (grid) => {
    return grid.length === 0
  },
  getGroups: (grid) => {
    const tilesSorted = [...grid].sort((a, b) => {
      const isSameRow = a.spotY === b.spotY
      if (isSameRow) {
        if (a.spotX <= b.spotX) {
          return -1
        }
        return 1
      }
      if (a.spotY <= b.spotY) {
        return -1
      }
      return 1
    })
    const groups = tilesSorted.reduce((groups, tile) => {
      const isGroup = groups.length > 0
      if (!isGroup) {
        return [[tile]]
      }

      const lastGroup = groups[groups.length - 1]
      const lastTileInLastGroup = lastGroup[lastGroup.length - 1]
      const lastGroupRow = lastTileInLastGroup.spotY
      const lastGroupColumn = lastTileInLastGroup.spotX
      const isFromSameRow = lastGroupRow === tile.spotY
      const isConsecutive = lastGroupColumn === tile.spotX - 1
      if (isFromSameRow && isConsecutive) {
        groups[groups.length - 1] = [...lastGroup, tile]
        return groups
      }

      return [...groups, [tile]]
    }, [])
    return groups
  }
}

const areConsecutive = (group) => {
  const areConsecutive = group.reduce(({previousValue}, tile) => {
    const isConsecutive = previousValue && previousValue + 1 === tile.value
    if (isConsecutive) {
      return { previousValue: tile.value, result: true }
    }
    return { previousValue: tile.value, result: false }
  }, { previousValue: null, result: false})

  return areConsecutive.result
}

const isValid = (group) => {
  if (group.length < 3) {
    return false
  }
  const groupValue = group[0].value
  const haveSameValue = group.every((tile) => tile.value === groupValue)
  const uniqueColors = new Set(group.map((tile) => tile.color))
  const allTilesHaveDifferentColors = uniqueColors.size === group.length
  if (haveSameValue && allTilesHaveDifferentColors) {
    return true
  }
  const groupColor = group[0].color
  const haveSameColor = group.every((tile) => tile.color === groupColor)
  if (haveSameColor && areConsecutive(group)) {
    return true
  }
  return false
}

const Group = {
  areConsecutive,
  isValid,
}

const Brain = {
  validate: (grid) => {
    if (Grid.isEmpty(grid)) {
      return false
    }
    const groups = Grid.getGroups(grid)
    return groups.every(Group.isValid)
  }
}

module.exports = Brain
