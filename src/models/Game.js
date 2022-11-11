const { v4 } = require('uuid')

const { generateGameCode } = require('../helpers')

let GAMES = {}

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
