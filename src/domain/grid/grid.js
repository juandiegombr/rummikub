function isEmpty(grid) {
  return grid.length === 0
}

function getGroups(grid) {
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

const Grid = {
  isEmpty,
  getGroups,
}

export { Grid }
