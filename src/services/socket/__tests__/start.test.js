const { initializeSocketService } = require('..')
const DB = require('../../../db')
const { User } = require('../../../models')
const SocketServerMock = require('./SocketServerMock')

jest.mock('../../../services/logger')

it('disconnects from the socket server', async function(done) {
  const firstUser = User.create({ name: 'Ramon' })
  const io = SocketServerMock()
  initializeSocketService(io)

  const [ client, server ] = io.client('1', { userId: firstUser.id })
  await client.emit('disconnect')

  expect(server.broadcast.emit).toHaveBeenCalledWith('LEAVED')
  done()
})

it('joins to a game', async function(done) {
  const user = User.create({ name: 'Ramon' })
  const game = DB.createGame(user)
  const io = SocketServerMock()
  initializeSocketService(io)

  const [ client, server ] = io.client('1', { userId: user.id })
  await client.emit('game:join', { data: { gameCode: game.code } })

  const updatedUser = User.get({ id: user.id })
  expect(updatedUser.socketId).toBe('1')
  expect(server.room).toBe(game.code)
  expect(server.emit).not.toHaveBeenCalledWith('game:start', expect.any(Array))
  done()
})

it('joins two players to a game', async function(done) {
  const firstUser = User.create({ name: 'Ramon' })
  const secondUser = User.create({ name: 'Pepe' })
  const game = DB.createGame(firstUser)
  const io = SocketServerMock()
  initializeSocketService(io)

  const [ firstClient, firstServer ] = io.client('1', { userId: firstUser.id })
  await firstClient.emit('game:join', { data: { gameCode: game.code } })
  const [ secondClient, secondServer ] = io.client('2', { userId: secondUser.id })
  await secondClient.emit('game:join', { data: { gameCode: game.code } })

  expect(firstServer.emit).toHaveBeenCalledWith('game:start', { tiles: expect.any(Array), users: expect.any(Array) })
  expect(secondServer.emit).toHaveBeenCalledWith('game:start', { tiles: expect.any(Array), users: expect.any(Array) })
  done()
})

it('rejoins to a game', async function(done) {
  const firstUser = User.create({ name: 'Ramon' })
  const secondUser = User.create({ name: 'Ramon' })
  const game = DB.createGame(firstUser)
  const io = SocketServerMock()
  initializeSocketService(io)

  const [ firstClient, firstServer ] = io.client('1', { userId: firstUser.id })
  await firstClient.emit('game:join', { data: { gameCode: game.code } })
  const [ secondClient, secondServer ] = io.client('2', { userId: secondUser.id })
  await secondClient.emit('game:join', { data: { gameCode: game.code } })
  await secondClient.emit('game:rejoin', { gameCode: game.code, data: { gameCode: game.code } })

  expect(firstServer.emit).toHaveBeenCalledWith('game:start', { tiles: expect.any(Array), users: expect.any(Array) })
  expect(firstServer.emit).not.toHaveBeenCalledWith('game:move', [])
  expect(secondServer.emit).toHaveBeenCalledWith('game:start', { tiles: expect.any(Array), users: expect.any(Array) })
  expect(secondServer.emit).toHaveBeenCalledWith('game:move', [])
  done()
})

it('rejoins to a game the user with turn', async function(done) {
  const firstUser = User.create({ name: 'Ramon' })
  const secondUser = User.create({ name: 'Ramon' })
  const game = DB.createGame(firstUser)
  const io = SocketServerMock()
  initializeSocketService(io)

  const [ firstClient, firstServer ] = io.client('1', { userId: firstUser.id })
  await firstClient.emit('game:join', { data: { gameCode: game.code } })
  const [ secondClient, secondServer ] = io.client('2', { userId: secondUser.id })
  await secondClient.emit('game:join', { data: { gameCode: game.code } })

  firstServer.emit.mockClear()
  await firstClient.emit('game:rejoin', { gameCode: game.code, data: { gameCode: game.code } })

  expect(firstServer.emit).toHaveBeenCalledWith('game:start', { tiles: expect.any(Array), users: expect.any(Array) })
  expect(firstServer.emit).toHaveBeenCalledWith('game:move', [])
  expect(firstServer.emit).toHaveBeenCalledWith('game:turn')
  done()
})
