const { v4 } = require('uuid')

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
