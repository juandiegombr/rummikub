function gameSerializer(game) {
  return {
    id: game.id,
    code: game.code,
    turn: game.turn,
    rounds: game.rounds,
    players: game.players,
    points: game.points,
  }
}

module.exports = { gameSerializer }
