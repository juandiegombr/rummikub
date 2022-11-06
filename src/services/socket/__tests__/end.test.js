const { initializeSocketService } = require('..')
const DB = require('../../../db')
const { User, Tile } = require('../../../models')
const { Brain } = require('../../brain')
const SocketServerMock = require('./SocketServerMock')

jest.mock('../../../services/logger')

afterEach(() => {
  DB.reset()
})

it('confirms a valid play', async function(done) {
  Brain.validate = jest.fn(() => true)
  const firstUser = User.create({ name: 'Ramon' })
  const secondUser = User.create({ name: 'Ramon' })
  const game = DB.createGame(firstUser)
  const io = SocketServerMock()
  initializeSocketService(io)

  const [ firstClient, firstServer ] = io.client('1', { userId: firstUser.id })
  await firstClient.emit('game:join', { data: { gameCode: game.code } })
  const [ secondClient, secondServer ] = io.client('2', { userId: secondUser.id })
  await secondClient.emit('game:join', { data: { gameCode: game.code } })

  const userTiles = Tile.getUserTiles(game, firstUser)
  await firstClient.emit('game:play', { gameCode: game.code, data: userTiles })
  
  const secondUserTiles = Tile.getUserTiles(game, secondUser)
  const rounds = [
    {
      total: [
        { [firstUser.name]: 0 },
        { [secondUser.name]: secondUserTiles.reduce((total, tile) => total + tile.value, 0) },
      ],
    }
  ]
  expect(firstServer.emit).toHaveBeenCalledWith('game:win')
  expect(firstServer.emit).toHaveBeenCalledWith('game:finish', rounds)
  expect(secondServer.emit).toHaveBeenCalledWith('game:finish', rounds)
  done()
})
