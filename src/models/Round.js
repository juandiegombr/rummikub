const { v4 } = require('uuid')

const { generateGameCode } = require('../helpers')

let ROUNDS = {}

function create() {
  const round = {
    id: v4(),
    gameId,
    userId,
    number,
    score,
  }
  ROUNDS[round.id] = round
  return ROUNDS[round.id]
}

function get(query) {
  return Object.values(ROUNDS).find((user) => {
    const queryParams = Object.entries(query)
    return queryParams.every(([key, value]) => {
        return user[key] === value
    })
  })
}

function filter(query) {
  return Object.values(ROUNDS).filter((user) => {
    const queryParams = Object.entries(query)
    return queryParams.every(([key, value]) => {
        return user[key] === value
    })
  })
}

function update(game, payload) {
  ROUNDS[game.id] = {...ROUNDS[game.id], ...payload}
  return ROUNDS[game.id]
}

const Round = {
  create,
  get,
  filter,
  update,
  debug: () => {
    console.log('ROUNDS', ROUNDS)
  },
  reset: () => {
    ROUNDS = {}
  }
}

module.exports = { Round }
