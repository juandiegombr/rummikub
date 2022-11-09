const { v4 } = require('uuid')
const { Game } = require('./Game')
const { Tile } = require('./Tile')

let USERS = {}

function create(params) {
  const user = {
    id: v4(),
    name: params.name,
    socketId: null,
    isFirstMove: true,
    gameId: null,
    order: null,
  }
  USERS[user.id] = user
  return user
}

function get(query) {
  return Object.values(USERS).find((user) => {
    const queryParams = Object.entries(query)
    return queryParams.every(([key, value]) => {
        return user[key] === value
    })
  })
}

function filterForClient(query) {
  const users = Object.values(USERS).filter((user) => {
    const queryParams = Object.entries(query)
    return queryParams.every(([key, value]) => {
        return user[key] === value
    })
  })
  const game = Game.get({ id: query.gameId })
  return users.map((user) => {
    const userTiles = Tile.getUserTiles(user)
    return {
      id: user.id,
      name: user.name,
      tiles: userTiles.length,
      turn: game.turn === user.order
    }
  })
}

function filter(query) {
  return Object.values(USERS).filter((user) => {
    const queryParams = Object.entries(query)
    return queryParams.every(([key, value]) => {
        return user[key] === value
    })
  })
}

function update(user, payload) {
  USERS[user.id] = {...USERS[user.id], ...payload}
  return USERS[user.id]
}


const User = {
  create,
  get,
  filterForClient,
  filter,
  update,
  debug: () => {
    console.log('USERS', USERS)
  },
  reset: () => {
    USERS = {}
  }
}

module.exports = { User }
