const { gameSerializer } = require('./game')
const { userSummarySerializer } = require('./user')

const Serializer = {
  game: gameSerializer,
  userSummary: userSummarySerializer,
}

module.exports = { Serializer }