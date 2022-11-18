const { v4 } = require('uuid')
const { Game } = require('./Game')

let USERS = {}

Game.modelRelations.push({
  name: 'users',
  func: (game) => filter({ gameId: game.id })
})

function UserModel(data) {
  if (!data) return
  const user = JSON.parse(JSON.stringify(data))
  Object.defineProperty(user,
    'game',
    {
      enumerable: true,
      configurable: true,
      get() {
        const freshUser = USERS[this.id]
        if (freshUser.gameId) {
          return Game.get({ id: freshUser.gameId })
        }
      },
    }
  )
  modelRelations.forEach((relation) => {
    Object.defineProperty(user,
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
  return user
}

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
  return UserModel(user)
}

function get(query) {
  const user = Object.values(USERS).find((user) => {
    const queryParams = Object.entries(query)
    return queryParams.every(([key, value]) => {
        return user[key] === value
    })
  })
  return UserModel(user)
}

function filter(query) {
  const users = Object.values(USERS).filter((user) => {
    const queryParams = Object.entries(query)
    return queryParams.every(([key, value]) => {
        return user[key] === value
    })
  })
  return users.map(UserModel)
}

function update(user, payload) {
  USERS[user.id] = {...USERS[user.id], ...payload}
  return UserModel(USERS[user.id] )
}

const modelRelations = []

const User = {
  create,
  get,
  filter,
  update,
  modelRelations,
  debug: () => {
    console.log('USERS', USERS)
  },
  reset: () => {
    USERS = {}
  }
}

module.exports = { User }
