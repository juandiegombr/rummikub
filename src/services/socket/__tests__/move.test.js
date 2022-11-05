const { initializeSocketService } = require('..')
const DB = require('../../../db')
const { Brain } = require('../../brain')
const SocketServerMock = require('./SocketServerMock')

jest.mock('../../../services/logger')

afterEach(() => {
  DB.reset()
})

it('receives the turn when the game starts', async function(done) {
  const firstUser = DB.User.create({ name: 'Ramon' })
  const secondUser = DB.User.create({ name: 'Pepe' })
  const game = DB.createGame(firstUser)
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
  const firstUser = DB.User.create({ name: 'Ramon' })
  const secondUser = DB.User.create({ name: 'Pepe' })
  const game = DB.createGame(firstUser)
  const io = SocketServerMock()
  initializeSocketService(io)

  const [ firstClient, firstServer ] = io.client('1', { userId: firstUser.id })
  await firstClient.emit('game:join', { data: { gameCode: game.code } })
  const [ secondClient, secondServer ] = io.client('2', { userId: secondUser.id })
  await secondClient.emit('game:join', { data: { gameCode: game.code } })

  const tile = DB.getPlayerTiles(game, firstUser.id)[0]
  await firstClient.emit('game:move', { gameCode: game.code, data: { tile, spot: { x: 0, y: 0 } } })

  expect(firstServer.emit).toHaveBeenCalledWith('game:move', expect.any(Array))
  expect(secondServer.emit).toHaveBeenCalledWith('game:move', expect.any(Array))
  done()
})

fit('confirms a valid play', async function(done) {
  Brain.validateFirstMove = jest.fn(() => true)
  Brain.validate = jest.fn(() => true)
  const firstUser = DB.User.create({ name: 'Ramon' })
  const secondUser = DB.User.create({ name: 'Ramon' })
  const game = DB.createGame(firstUser)
  const io = SocketServerMock()
  initializeSocketService(io)

  const [ firstClient, firstServer ] = io.client('1', { userId: firstUser.id })
  await firstClient.emit('game:join', { data: { gameCode: game.code } })
  const [ secondClient, secondServer ] = io.client('2', { userId: secondUser.id })
  await secondClient.emit('game:join', { data: { gameCode: game.code } })

  await firstClient.emit('game:play', { gameCode: game.code, data: [] })

  expect(secondServer.emit).toHaveBeenCalledWith('game:turn')
  done()
})

it('rejects an invalid play', async function(done) {
  const firstUser = DB.User.create({ name: 'Ramon' })
  const secondUser = DB.User.create({ name: 'Pepe' })
  const game = DB.createGame(firstUser)
  const io = SocketServerMock()
  initializeSocketService(io)

  const [ firstClient, firstServer ] = io.client('1', { userId: firstUser.id })
  await firstClient.emit('game:join', { data: { gameCode: game.code } })
  const [ secondClient, secondServer ] = io.client('2', { userId: secondUser.id })
  await secondClient.emit('game:join', { data: { gameCode: game.code } })

  await firstClient.emit('game:play', { gameCode: game.code, data: [] })

  expect(firstServer.emit).toHaveBeenCalledWith('game:play:ko')
  done()
})

it('pass the turn', async function(done) {
  const firstUser = DB.User.create({ name: 'Ramon' })
  const secondUser = DB.User.create({ name: 'Pepe' })
  const game = DB.createGame(firstUser)
  const io = SocketServerMock()
  initializeSocketService(io)

  const [ firstClient, firstServer ] = io.client('1', { userId: firstUser.id })
  await firstClient.emit('game:join', { data: { gameCode: game.code } })
  const [ secondClient, secondServer ] = io.client('2', { userId: secondUser.id })
  await secondClient.emit('game:join', { data: { gameCode: game.code } })

  await firstClient.emit('game:pass', { gameCode: game.code, data: { x: 0, y: 0 }})

  expect(firstServer.emit).toHaveBeenCalledWith('game:pass:ok', {
    tiles: expect.any(Array),
    tile: expect.any(Object),
    grid: [],
  })
  expect(secondServer.emit).toHaveBeenCalledWith('game:turn')
  done()
})

it('returns the turn to the first user when the last user plays', async function(done) {
  const firstUser = DB.User.create({ name: 'Ramon' })
  const secondUser = DB.User.create({ name: 'Pepe' })
  const game = DB.createGame(firstUser)
  const io = SocketServerMock()
  initializeSocketService(io)
  const [ firstClient, firstServer ] = io.client('1', { userId: firstUser.id })
  await firstClient.emit('game:join', { data: { gameCode: game.code } })
  const [ secondClient, secondServer ] = io.client('2', { userId: secondUser.id })
  await secondClient.emit('game:join', { data: { gameCode: game.code } })

  await firstClient.emit('game:play', { gameCode: game.code, data: [] })
  await secondClient.emit('game:play', { gameCode: game.code, data: [] })

  expect(firstServer.emit).toHaveBeenCalledWith('game:turn')
  done()
})

it('updates the player grid', async function(done) {
  const firstUser = DB.User.create({ name: 'Ramon' })
  const secondUser = DB.User.create({ name: 'Pepe' })
  const game = DB.createGame(firstUser)
  const io = SocketServerMock()
  initializeSocketService(io)
  const [ firstClient, firstServer ] = io.client('1', { userId: firstUser.id })
  await firstClient.emit('game:join', { data: { gameCode: game.code } })
  const [ secondClient, secondServer ] = io.client('2', { userId: secondUser.id })
  await secondClient.emit('game:join', { data: { gameCode: game.code } })

  const tiles = JSON.parse(JSON.stringify(DB.getPlayerTiles(game, firstUser.id)))
  tiles[0].spotX = 9
  tiles[0].spotY = 1
  await firstClient.emit('game:move:self', { gameCode: game.code, data: tiles })

  expect(DB.getPlayerTiles(game, firstUser.id)).toEqual(tiles)
  done()
})