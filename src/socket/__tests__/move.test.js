import { jest } from '@jest/globals'

import DB from '../../db'
import { User } from '../../models'
import { Brain } from '../../services/brain'
import { initializeSocketService } from '../../socket'
import SocketServerMock from './SocketServerMock'

afterEach(() => {
  DB.reset()
})

it('receives the turn when the game starts', async function (done) {
  const firstUser = User.create({ name: 'Ramon' })
  const secondUser = User.create({ name: 'Pepe' })
  const game = DB.createGame()
  const io = SocketServerMock()
  initializeSocketService(io)

  const [firstClient, firstServer] = io.client('1', { userId: firstUser.id })
  await firstClient.emit('game:join', { data: { gameCode: game.code } })
  const [secondClient, secondServer] = io.client('2', { userId: secondUser.id })
  await secondClient.emit('game:join', { data: { gameCode: game.code } })

  expect(firstServer.emit).toHaveBeenCalledWith('game:turn')
  done()
})

it('confirms a valid play', async function (done) {
  Brain.validate = jest.fn(() => true)
  const firstUser = User.create({ name: 'Ramon' })
  const secondUser = User.create({ name: 'Ramon' })
  const game = DB.createGame()
  const io = SocketServerMock()
  initializeSocketService(io)

  const [firstClient, firstServer] = io.client('1', { userId: firstUser.id })
  await firstClient.emit('game:join', { data: { gameCode: game.code } })
  const [secondClient, secondServer] = io.client('2', { userId: secondUser.id })
  await secondClient.emit('game:join', { data: { gameCode: game.code } })

  await firstClient.emit('game:play', { gameCode: game.code, data: [] })

  expect(secondServer.emit).toHaveBeenCalledWith('game:turn')
  done()
})

it('rejects an invalid play', async function (done) {
  Brain.validate = jest.fn(() => false)
  const firstUser = User.create({ name: 'Ramon' })
  const secondUser = User.create({ name: 'Pepe' })
  const game = DB.createGame()
  const io = SocketServerMock()
  initializeSocketService(io)

  const [firstClient, firstServer] = io.client('1', { userId: firstUser.id })
  await firstClient.emit('game:join', { data: { gameCode: game.code } })
  const [secondClient, secondServer] = io.client('2', { userId: secondUser.id })
  await secondClient.emit('game:join', { data: { gameCode: game.code } })

  await firstClient.emit('game:play', { gameCode: game.code, data: [] })

  expect(firstServer.emit).toHaveBeenCalledWith('game:play:ko')
  done()
})

it('pass the turn', async function (done) {
  const firstUser = User.create({ name: 'Ramon' })
  const secondUser = User.create({ name: 'Pepe' })
  const game = DB.createGame()
  const io = SocketServerMock()
  initializeSocketService(io)

  const [firstClient, firstServer] = io.client('1', { userId: firstUser.id })
  await firstClient.emit('game:join', { data: { gameCode: game.code } })
  const [secondClient, secondServer] = io.client('2', { userId: secondUser.id })
  await secondClient.emit('game:join', { data: { gameCode: game.code } })

  await firstClient.emit('game:pass', {
    gameCode: game.code,
    data: { x: 0, y: 0 },
  })

  expect(firstServer.emit).toHaveBeenCalledWith('game:pass:ok', {
    tiles: expect.any(Array),
    tile: expect.any(Object),
    grid: [],
  })
  expect(secondServer.emit).toHaveBeenCalledWith('game:turn')
  done()
})

it('returns the turn to the first user when the last user plays', async function (done) {
  const firstUser = User.create({ name: 'Ramon' })
  const secondUser = User.create({ name: 'Pepe' })
  const game = DB.createGame()
  const io = SocketServerMock()
  initializeSocketService(io)
  const [firstClient, firstServer] = io.client('1', { userId: firstUser.id })
  await firstClient.emit('game:join', { data: { gameCode: game.code } })
  const [secondClient, secondServer] = io.client('2', { userId: secondUser.id })
  await secondClient.emit('game:join', { data: { gameCode: game.code } })

  await firstClient.emit('game:play', { gameCode: game.code, data: [] })
  await secondClient.emit('game:play', { gameCode: game.code, data: [] })

  expect(firstServer.emit).toHaveBeenCalledWith('game:turn')
  done()
})

it('updates the player grid', async function (done) {
  const firstUser = User.create({ name: 'Ramon' })
  const secondUser = User.create({ name: 'Pepe' })
  const game = DB.createGame()
  const io = SocketServerMock()
  initializeSocketService(io)
  const [firstClient, firstServer] = io.client('1', { userId: firstUser.id })
  await firstClient.emit('game:join', { data: { gameCode: game.code } })
  const [secondClient, secondServer] = io.client('2', { userId: secondUser.id })
  await secondClient.emit('game:join', { data: { gameCode: game.code } })

  const userTiles = firstUser.tiles
  userTiles[0].spotX = 9
  userTiles[0].spotY = 1
  await firstClient.emit('game:move:self', {
    gameCode: game.code,
    data: userTiles,
  })

  const updatedUserTiles = firstUser.tiles
  expect(updatedUserTiles[0].spotX).toEqual(userTiles[0].spotX)
  expect(updatedUserTiles[0].spotY).toEqual(userTiles[0].spotY)
  done()
})
