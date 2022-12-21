function gameSerializer(game) {
  return {
    id: game.id,
    code: game.code,
    turn: game.turn,
    round: game.round,
    players: game.players,
    points: game.points,
  }
}

export { gameSerializer }
