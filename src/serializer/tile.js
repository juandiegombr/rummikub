function tileSerializer(tile) {
  return {
    id: tile.id,
    code: tile.code,
    value: tile.value,
    color: tile.color,
    area: tile.area,
    spotX: tile.spotX,
    spotY: tile.spotY,
  }
}

export { tileSerializer }
