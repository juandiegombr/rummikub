function userSummarySerializer(user) {
  return {
    id: user.id,
    name: user.name,
    tiles: user.tiles.length,
    turn: user.order === user.game.turn,
  }
}

export { userSummarySerializer }
