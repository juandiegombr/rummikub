const { v4 } = require('uuid')

const { generateGameCode } = require('../helpers')

let GAMES = {}

function GameModel(data) {
  if (!data) return

  const game = JSON.parse(JSON.stringify(data))
  modelRelations.forEach((relation) => {
    Object.defineProperty(game,
      relation.name,
      {
        enumerable: true,
        configurable: true,
        get() {
          return relation.func(this)
        },
      }
    )
  })
  return game
}

const getDefaultGameSettings = () => {
  return {
    gameCode: generateGameCode(),
    players: 2,
    points: 50,
  }
}

function create(payload) {
  const gameSettings = {...getDefaultGameSettings(), ...payload}
  const game = {
    id: v4(),
    code: gameSettings.gameCode,
    turn: 0,
    rounds: 1,
    players: Number(gameSettings.players),
    points: Number(gameSettings.points),
  }
  GAMES[game.id] = game
  return GameModel(game)
}

function get(query) {
  const game = Object.values(GAMES).find((user) => {
    const queryParams = Object.entries(query)
    return queryParams.every(([key, value]) => {
        return user[key] === value
    })
  })
  return GameModel(game)
}

function getByCode(gameCode) {
  return get({ code: gameCode })
}

function update(game, payload) {
  GAMES[game.id] = {...GAMES[game.id], ...payload}
  return GameModel(GAMES[game.id])
}

const modelRelations = []

const Game = {
  create,
  get,
  getByCode,
  update,
  modelRelations,
  debug: () => {
    console.log('GAMES', GAMES)
  },
  reset: () => {
    GAMES = {}
  }
}

module.exports = { Game }
