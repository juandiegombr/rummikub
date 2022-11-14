const { v4 } = require('uuid')
const { TileService } = require('../domain/tile')
const { Tile } = require('./Tile')
const { User } = require('./User')

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
  ROUNDS[game.id] = {...ROUNDS[game.id], ...payload}
  return ROUNDS[game.id]
}

function createForGame(game) {
  const usersInGame = User.filter({ gameId: game.id })
  usersInGame.forEach((user) => {
    const userTiles = Tile.getUserTiles(user)
    const score = TileService.getScore(userTiles)
    Round.create({ score, number: game.round, game, user })
  })
}

function getForGame(game) {
  const usersInGame = User.filter({ gameId: game.id })
  return usersInGame.map((user) => {
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
  }
}

module.exports = { Round }
