const { Game, User, Tile } = require("../models")
const { Socket } = require('../services/socket')

function assignTiles(game, user) {
  const unassignedTiles = Tile.filter({ gameId: game.id, userId: null })
  const tilesToAssign = unassignedTiles.splice(0, 14)
  const userSpots = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
    { x: 4, y: 0 },
    { x: 5, y: 0 },
    { x: 6, y: 0 },
    { x: 7, y: 0 },
    { x: 8, y: 0 },
    { x: 9, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 3, y: 1 },
  ]
  tilesToAssign.forEach((tile, index) => {
    const spot = userSpots[index]
    Tile.update(tile, {
      area: 'player',
      userId: user.id,
      spotX: spot.x,
      spotY: spot.y,
    })
  })
}

async function execute({ socket, gameCode }) {
  const userId = Socket.getId(socket)
  const user = User.get({ id: userId })
  const game = Game.getByCode(gameCode)
  assignTiles(game, user)
  const userTiles = Tile.getUserTiles(user)
  socket.emit('game:start', userTiles)
  const remainingTiles = Tile.filterUnassigned(game)
  const users = User.filterForClient({ gameId: game.id })
  socket.emit('game:summary', { users, remainingTiles: remainingTiles.length })
}

const roundStart = {
  execute,
}

module.exports = { roundStart }