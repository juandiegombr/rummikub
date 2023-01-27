import { jest } from '@jest/globals'

import { Brain } from '../../services/brain'
import { initGame, resetDB } from './game.scenario'

afterEach(resetDB)

it('confirms a valid play', async function (done) {
  Brain.validate = jest.fn(() => true)
  const {
    game,
    firstUser,
    firstClient,
    firstServer,
    secondUser,
    secondServer,
  } = await initGame({ gameCode: 'AAAA' })

  await firstClient.emit('game:play', {
    gameCode: game.code,
    data: firstUser.tiles,
  })

  const expectedRounds = [
    {
      userName: firstUser.name,
      scores: [0],
      total: 0,
    },
    {
      userName: secondUser.name,
      scores: [103],
      total: 103,
    },
  ]
  expect(firstServer.emit).toHaveBeenCalledWith('game:win')
  expect(firstServer.emit).toHaveBeenCalledWith('game:finish', expectedRounds)
  expect(secondServer.emit).toHaveBeenCalledWith('game:finish', expectedRounds)
  expect(secondServer.emit).toHaveBeenCalledWith('game:move', expect.any(Array))
  done()
})
