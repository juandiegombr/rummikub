import { v4 } from 'uuid'

import { generateGameCode } from '../helpers/index.js'

let GAMES = {}

function GameModel(data) {
  if (!data) return

  const game = JSON.parse(JSON.stringify(data))
  modelRelations.forEach((relation) => {
    Object.defineProperty(game, relation.name, {
      enumerable: true,
      configurable: true,
      get() {
        return relation.func(this)
      },
    })
  })
  return game
}

const getDefaultGameSettings = () => {
  return {
    code: generateGameCode(),
    players: 2,
    points: 50,
  }
}

function create(payload) {
  const gameSettings = { ...getDefaultGameSettings(), ...payload }
  const game = {
    id: v4(),
    code: gameSettings.code,
    turn: 0,
    round: 1,
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

function update(game, payload) {
  GAMES[game.id] = { ...GAMES[game.id], ...payload }
  return GameModel(GAMES[game.id])
}

const modelRelations = []

const Game = {
  create,
  get,
  update,
  modelRelations,
  debug: () => {
    console.log('GAMES', GAMES)
  },
  reset: () => {
    GAMES = {}
  },
}

export { Game }
