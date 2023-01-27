import { TileService } from '../../domain/tile'
import { Game, Tile, User } from '../../models'
import { initializeSocketService } from '../../socket'
import SocketServerMock from './SocketServerMock'

async function initGame({ gameCode }) {
  const firstUser = User.create({ name: 'Ramon' })
  const secondUser = User.create({ name: 'Pepe' })
  const game = Game.create({ code: gameCode })
  TileService.generateTiles()
    .reverse()
    .map((tile) => Tile.create({ ...tile, game }))
  const io = SocketServerMock()
  initializeSocketService(io)

  const [firstClient, firstServer] = io.client('1', { userId: firstUser.id })
  await firstClient.emit('game:join', { data: { gameCode: game.code } })
  const [secondClient, secondServer] = io.client('2', { userId: secondUser.id })
  await secondClient.emit('game:join', { data: { gameCode: game.code } })

  return {
    game,
    firstUser,
    firstClient,
    firstServer,
    secondUser,
    secondClient,
    secondServer,
  }
}

async function setRound(scores) {
  const firstUser = User.create({ name: 'Ramon' })
  const secondUser = User.create({ name: 'Pepe' })
  const game = Game.create()
  game.code = gameCode
  TileService.generateTiles()
    .reverse()
    .map((tile) => Tile.create({ ...tile, game }))
  const io = SocketServerMock()
  initializeSocketService(io)

  const [firstClient, firstServer] = io.client('1', { userId: firstUser.id })
  await firstClient.emit('game:join', { data: { gameCode: game.code } })
  const [secondClient, secondServer] = io.client('2', { userId: secondUser.id })
  await secondClient.emit('game:join', { data: { gameCode: game.code } })

  return {
    game,
    firstUser,
    firstClient,
    firstServer,
    secondUser,
    secondClient,
    secondServer,
  }
}

function resetDB() {
  Game.reset()
  Tile.reset()
  User.reset()
}

export { initGame, resetDB }
