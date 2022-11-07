const { initGame, resetDB } = require('./game.scenario')

const { Tile } = require('../../models')
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
