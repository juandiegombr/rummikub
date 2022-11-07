const { v4 } = require('uuid')
const { TileService } = require('../domain/tile')
const { Tile } = require('./Tile')
const { User } = require('./User')

let ROUNDS = {}

function create({ game, user, score }) {
  const round = {
    id: v4(),
    gameId: game.id,
    userId: user.id,
    number: game.rounds,
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
    const userTiles = Tile.getUserTiles(game, user)
    const score = TileService.getScore(userTiles)
    Round.create({ game, user, score })
  })
}

function getForGame(game) {
  const usersInGame = User.filter({ gameId: game.id })
  return Array.from({ length: game.rounds }).map((_, index) => {
    const roundNumber = index + 1
    return usersInGame.map((user) => {
      const userRound = Round.get({ userId: user.id, gameId: game.id, number: roundNumber })
      return { [user.name]: userRound.score}
    })
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
