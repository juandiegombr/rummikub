const { v4 } = require('uuid')

const { generateGameCode } = require('../helpers')

let GAMES = {}

function create() {
  const game = {
    id: v4(),
    code: generateGameCode(),
    turn: 0,
    rounds: 1,
  }
  GAMES[game.id] = game
  return GAMES[game.id]
}

function get(query) {
  return Object.values(GAMES).find((user) => {
    const queryParams = Object.entries(query)
    return queryParams.every(([key, value]) => {
        return user[key] === value
    })
  })
}

function getByCode(gameCode) {
  return get({ code: gameCode })
}

function update(game, payload) {
  GAMES[game.id] = {...GAMES[game.id], ...payload}
  return GAMES[game.id]
}

const Game = {
  create,
  get,
  getByCode,
  update,
  debug: () => {
    console.log('GAMES', GAMES)
  },
  reset: () => {
    GAMES = {}
  }
}

module.exports = { Game }
