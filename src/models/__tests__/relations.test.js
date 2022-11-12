const { Game } = require('../Game')
const { Tile } = require('../Tile')
const { User } = require('../User')


fit('a user has its direct relation with game', () => {
  const user = User.create({ name: 'Ramon' })
  const game = Game.create()
  User.update(user, { gameId: game.id })

  expect(user.game.id).toBe(game.id)
})

fit('a tile has its direct relation with user', () => {
  const user = User.create({ name: 'Ramon' })
  const game = Game.create()
  const tile = Tile.create({ code: 'code', value: 1, color: 'red' }, game)
  Tile.update(tile, { userId: user.id })

  expect(tile.user.id).toBe(user.id)
})

fit('a tile has its direct relation with user', () => {
  const game = Game.create()
  const tile = Tile.create({ code: 'code', value: 1, color: 'red' }, game)

  expect(tile.game.id).toBe(game.id)
})

fit('a game has its foreign relation with users', () => {
  const user = User.create({ name: 'Ramon' })
  const game = Game.create()
  User.update(user, { gameId: game.id })

  expect(game.users).toHaveLength(1)
  expect(game.users[0].id).toBe(user.id)
})

fit('a game has its foreign relation with tiles', () => {
  const game = Game.create()
  const tile = Tile.create({ code: 'code', value: 1, color: 'red' }, game)

  expect(game.tiles).toHaveLength(1)
  expect(game.tiles[0].id).toBe(tile.id)
})

fit('a user has its foreign relation with tiles', () => {
  const user = User.create({ name: 'Ramon' })
  const game = Game.create()
  const tile = Tile.create({ code: 'code', value: 1, color: 'red' }, game)
  Tile.update(tile, { userId: user.id })

  expect(user.tiles).toHaveLength(1)
  expect(user.tiles[0].id).toBe(tile.id)
})