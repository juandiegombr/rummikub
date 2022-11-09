const { initGame, resetDB } = require('./game.scenario')

const { Tile, User } = require('../../models')
const { Brain } = require('../../services/brain')

jest.mock('../../services/logger')

afterEach(resetDB)

it('confirms a valid play', async function(done) {
  Brain.validate = jest.fn(() => true)
  const {
    game,
    firstUser,
    firstClient,
    firstServer,
    secondUser,
    secondServer,
  } = await initGame({ gameCode: 'AAAA' })

  const userTiles = Tile.getUserTiles(User.get({ id: firstUser.id }))
  await firstClient.emit('game:play', { gameCode: game.code, data: userTiles })

  const secondUserTiles = Tile.getUserTiles(User.get({ id: secondUser.id }))
  const expectedRounds = [
    {
      scores: [0],
      total: 0,
      userName: firstUser.name,
    },
    {
      scores: [secondUserTiles.reduce((total, tile) => total + tile.value, 0)],
      total: secondUserTiles.reduce((total, tile) => total + tile.value, 0),
      userName: secondUser.name,
    },
  ]
  expect(firstServer.emit).toHaveBeenCalledWith('game:win')
  expect(firstServer.emit).toHaveBeenCalledWith('game:finish', expectedRounds)
  expect(secondServer.emit).toHaveBeenCalledWith('game:finish', expectedRounds)
  expect(secondServer.emit).toHaveBeenCalledWith('game:move', expect.any(Array))
  done()
})
