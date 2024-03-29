import DB from '../db/index.js'
import { Game, Round, Tile, User } from '../models/index.js'
import { Serializer } from '../serializer/index.js'
import { Brain } from '../services/brain/index.js'
import { Socket } from '../services/socket/index.js'

async function execute({ socket, gameCode, data: newCommonTiles }) {
  const game = Game.get({ code: gameCode })
  const userId = Socket.getId(socket)
  const user = User.get({ id: userId })
  const commonTiles = DB.getGrid(gameCode)

  const isValid = Brain.validate({
    newCommonTiles,
    commonTiles,
    userTiles: user.tiles,
    isFirstMove: user.isFirstMove,
  })

  if (!isValid) {
    return sendInvalidPlay({ socket })
  }

  User.update(user, { isFirstMove: false })
  Tile.updateGrid(newCommonTiles)

  const hasFinished = user.tiles.length === 0
  if (hasFinished) {
    return finishRound({ socket, gameCode })
  }

  sendValidPlay({ socket })

  const nextPlayer = DB.nextTurn(game)
  const nextPlayerSocket = Socket.getById(nextPlayer.socketId)
  nextPlayerSocket.emit('game:turn')

  const clients = await Socket.getClientsFromRoom(gameCode)
  const grid = DB.getGrid(gameCode)
  clients.forEach((client) => {
    client.emit('game:move', grid.map(Serializer.tile))
  })
  Socket.updateGameStatus(game)
}

function sendValidPlay({ socket }) {
  socket.emit('game:play:ok')
}

function sendInvalidPlay({ socket }) {
  socket.emit('game:play:ko')
}

function prepareNewRound(game) {
  DB.createTiles(game)
  Game.update(game, { round: game.round + 1 })
  const users = User.filter({ gameId: game.id })
  users.forEach((user) => {
    User.update(user, { isFirstMove: true })
  })
}

async function finishRound({ socket, gameCode }) {
  const game = Game.get({ code: gameCode })
  Round.createForGame(game)
  const clients = await Socket.getClientsFromRoom(gameCode)
  const grid = DB.getGrid(gameCode)
  const rounds = Round.getForGame(game)
  clients.forEach((client) => {
    client.emit('game:move', grid.map(Serializer.tile))
    client.emit('game:finish', rounds)
  })
  socket.emit('game:win')
  prepareNewRound(game)
}

const play = {
  execute,
}

export { play }
