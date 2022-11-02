const { initializeSocketService } = require('..')
const DB = require('../../../db')
const SocketServerMock = require('./SocketServerMock')

jest.mock('../../../services/logger')

it('receives the turn when the game starts', async function(done) {
  const firstUser = DB.User.create()
  const secondUser = DB.User.create()
  const game = DB.createGame(firstUser)
  DB.joinGame(game, secondUser)
  const io = SocketServerMock()
  initializeSocketService(io)

  const [ firstClient, firstServer ] = io.client('1', { userId: firstUser.id })
  await firstClient.emit('game:join', { data: { gameCode: game.code } })
  const [ secondClient, secondServer ] = io.client('2', { userId: secondUser.id })
  await secondClient.emit('game:join', { data: { gameCode: game.code } })

  expect(firstServer.emit).toHaveBeenCalledWith('game:turn')
  done()
})

it('makes a move', async function(done) {
  const firstUser = DB.User.create()
  const secondUser = DB.User.create()
  const game = DB.createGame(firstUser)
  DB.joinGame(game, secondUser)
  const tile = DB.getPlayerTiles(game.code, firstUser.id)[0]
  const io = SocketServerMock()
  initializeSocketService(io)

  const [ firstClient, firstServer ] = io.client('1', { userId: firstUser.id })
  await firstClient.emit('game:join', { data: { gameCode: game.code } })
  const [ secondClient, secondServer ] = io.client('2', { userId: secondUser.id })
  await secondClient.emit('game:join', { data: { gameCode: game.code } })

  await firstClient.emit('game:move', { room: `room:${game.code}`, data: { tile, spot: { x: 0, y: 0 } } })

  expect(firstServer.emit).toHaveBeenCalledWith('game:move', expect.any(Array))
  expect(secondServer.emit).toHaveBeenCalledWith('game:move', expect.any(Array))
  done()
})

it('confirms the play', async function(done) {
  const firstUser = DB.User.create()
  const secondUser = DB.User.create()
  const game = DB.createGame(firstUser)
  DB.joinGame(game, secondUser)
  const io = SocketServerMock()
  initializeSocketService(io)

  const [ firstClient, firstServer ] = io.client('1', { userId: firstUser.id })
  await firstClient.emit('game:join', { data: { gameCode: game.code } })
  const [ secondClient, secondServer ] = io.client('2', { userId: secondUser.id })
  await secondClient.emit('game:join', { data: { gameCode: game.code } })

  await firstClient.emit('game:play', { room: `room:${game.code}` })

  expect(secondServer.emit).toHaveBeenCalledWith('game:turn')
  done()
})

fit('pass the turn', async function(done) {
  const firstUser = DB.User.create()
  const secondUser = DB.User.create()
  const game = DB.createGame(firstUser)
  DB.joinGame(game, secondUser)
  const io = SocketServerMock()
  initializeSocketService(io)

  const [ firstClient, firstServer ] = io.client('1', { userId: firstUser.id })
  await firstClient.emit('game:join', { data: { gameCode: game.code } })
  const [ secondClient, secondServer ] = io.client('2', { userId: secondUser.id })
  await secondClient.emit('game:join', { data: { gameCode: game.code } })

  await firstClient.emit('game:pass', { room: `room:${game.code}` })

  expect(firstServer.emit).toHaveBeenCalledWith('game:pass', expect.any(Object))
  expect(secondServer.emit).toHaveBeenCalledWith('game:turn')
  done()
})

it('returns the turn to the first user when the las user plays', async function(done) {
  const firstUser = DB.User.create()
  const secondUser = DB.User.create()
  const game = DB.createGame(firstUser)
  DB.joinGame(game, secondUser)
  const io = SocketServerMock()
  initializeSocketService(io)
  const [ firstClient, firstServer ] = io.client('1', { userId: firstUser.id })
  await firstClient.emit('game:join', { data: { gameCode: game.code } })
  const [ secondClient, secondServer ] = io.client('2', { userId: secondUser.id })
  await secondClient.emit('game:join', { data: { gameCode: game.code } })

  await firstClient.emit('game:play', { room: `room:${game.code}` })
  await secondClient.emit('game:play', { room: `room:${game.code}` })

  expect(firstServer.emit).toHaveBeenCalledWith('game:turn')
  done()
})