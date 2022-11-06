const { v4 } = require('uuid')

const { generateGameCode } = require('../helpers')

let GAMES = {}

const Game = {
  create: () => {
    const game = {
      id: v4(),
      code: generateGameCode(),
      turn: 0
    }
    GAMES[game.id] = game
    return GAMES[game.id]
  },
  get: (gameId) => {
    GAMES[gameId]
  },
  getByCode: (gameCode) => {
    return Object.values(GAMES).find((game) => game.code === gameCode)
  },
  update: (game, payload) => {
    GAMES[game.id] = {...GAMES[game.id], ...payload}
    return GAMES[game.id]
  },
  debug: () => {
    console.log('GAMES', GAMES)
  },
  reset: () => {
    GAMES = {}
  }
}

module.exports = { Game }
