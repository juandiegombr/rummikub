const { gameSerializer } = require('./game')
const { userSummarySerializer } = require('./user')
const { tileSerializer } = require('./tile')

const Serializer = {
  game: gameSerializer,
  userSummary: userSummarySerializer,
  tile: tileSerializer,
}

module.exports = { Serializer }