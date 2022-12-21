import { Game, Tile, User } from '../models/index.js'
import { Logger } from '../services/logger/index.js'
import { Socket } from '../services/socket/index.js'

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
  const room = gameCode
  socket.join(gameCode)
  const userId = Socket.getId(socket)
  const user = User.get({ id: userId })
  const game = Game.get({ code: gameCode })
  const order = game.users.length
  User.update(user, { gameId: game.id, order, socketId: socket.id })
  assignTiles(game, user)
  const playersInRoom = await Socket.countClients(room)

  Logger.send(`Websocket: ${playersInRoom} user joined to the game ${gameCode}`)

  const clients = await Socket.getClientsFromRoom(gameCode)
  if (clients.length === game.players) {
    Socket.startGame(game)
    Socket.updateGameStatus(game)
    Socket.startTurn(gameCode)
  }
}

const join = {
  execute,
}

export { join }
