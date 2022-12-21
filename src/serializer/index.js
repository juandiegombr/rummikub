import { gameSerializer } from './game.js'
import { tileSerializer } from './tile.js'
import { userSummarySerializer } from './user.js'

const Serializer = {
  game: gameSerializer,
  userSummary: userSummarySerializer,
  tile: tileSerializer,
}

export { Serializer }
