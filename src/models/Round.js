import { v4 } from 'uuid'

import { TileService } from '../domain/tile/index.js'

let ROUNDS = {}

function create({ number, score, game, user }) {
  const round = {
    id: v4(),
    gameId: game.id,
    userId: user.id,
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
  ROUNDS[game.id] = { ...ROUNDS[game.id], ...payload }
  return ROUNDS[game.id]
}

function createForGame(game) {
  game.users.forEach((user) => {
    const score = TileService.getScore(user.tiles)
    Round.create({ score, number: game.round, game, user })
  })
}

function getForGame(game) {
  return game.users.map((user) => {
    const userRounds = Round.filter({ userId: user.id, gameId: game.id })
    const scores = userRounds.map((userRound) => userRound.score)
    const total = scores.reduce((total, score) => total + score, 0)
    return {
      userName: user.name,
      scores,
      total,
    }
  })
}

const Round = {
  create,
  get,
  filter,
  createForGame,
  getForGame,
  update,
  debug: () => {
    console.log('ROUNDS', ROUNDS)
  },
  reset: () => {
    ROUNDS = {}
  },
}

export { Round }
