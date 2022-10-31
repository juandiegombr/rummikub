const GAMES = {}

function getGames() {
  return GAMES
}

function getGame(gameCode) {
  return GAMES[gameCode]
}

function getPlayerTiles(gameCode, userId) {
  return getGame(gameCode).players[userId]
}

function getGrid(gameCode) {
  return getGame(gameCode).grid
}

function move(gameCode, userId, move) {
  const gameData = getGame(gameCode)
  gameData.grid = {...gameData.grid, [move.tile.id]: move}
  let playerTiles = getPlayerTiles(gameCode, userId)
  gameData.players[userId] = playerTiles.filter((tile) => tile.id !== move.tile.id)
  return gameData.grid
}

module.exports = { getGame, getGames, getGrid, getPlayerTiles, move }
