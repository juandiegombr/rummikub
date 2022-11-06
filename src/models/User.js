const { v4 } = require('uuid')

let USERS = {}

const User = {
  create: ({ name, order = null, gameId = null }) => {
    const user = {
      id: v4(),
      name,
      socketId: null,
      isFirstMove: true,
      gameId,
      order,
    }
    USERS[user.id] = user
    return user
  },
  get: (query) => {
    return Object.values(USERS).find((user) => {
      const queryParams = Object.entries(query)
      return queryParams.every(([key, value]) => {
          return user[key] === value
      })
    })
  },
  getByGameCode: (gameCode) => {
    const game = Game.getByCode(gameCode)
    const userIds = game.users
    return userIds.map((userId) => USERS[userId])
  },
  filter: (query) => {
    return Object.values(USERS).filter((user) => {
      const queryParams = Object.entries(query)
      return queryParams.every(([key, value]) => {
          return user[key] === value
      })
    })
  },
  update: (userId, payload) => {
    USERS[userId] = {...USERS[userId], ...payload}
    return USERS[userId]
  },
  debug: () => {
    console.log('USERS', USERS)
  },
  reset: () => {
    USERS = {}
  }
}

module.exports = { User }
