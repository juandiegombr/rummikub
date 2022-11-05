const request = require('supertest')

const { app } = require('../../server')
const DB = require('../../db')

jest.mock('../../helpers', () => {
  return {
    generateGameCode: jest.fn().mockReturnValue('ABCD')
  }
})

afterEach(() => {
  DB.reset()
})

it('creates a new game', (done) => {
  const user = DB.User.create({ name: 'Ramon' })

  request(app)
    .get('/api/game/create/')
    .set('x-user-id', user.id)
    .expect((res) => {
      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual({ userId: user.id, gameCode: 'ABCD' })
      expect(DB.Game.getByCode('ABCD')).toEqual(
        { code: 'ABCD', id: expect.any(String), turn: 0 }
      )
    })
    .end(done)
})

it('joins a created game', (done) => {
  const user = DB.User.create({ name: 'Ramon' })
  const game = DB.Game.create(user)

  request(app)
    .get(`/api/game/join/${game.code}`)
    .set('x-user-id', user.id)
    .expect((res) => {
      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual({ userId: user.id, gameCode: game.code })
    })
    .end(done)
})

it('tries to joins a not found game', (done) => {
  const user = DB.User.create({ name: 'Ramon' })
  DB.Game.create(user)

  request(app)
    .get('/api/game/join/BBBB')
    .expect(404)
    .end(done)
})

it('re-joins a created game', (done) => {
  const user = DB.User.create({ name: 'Ramon' })
  const game = DB.Game.create(user)
  DB.User.update(user.id, { gameId: game.id, order: 0 })

  request(app)
    .get(`/api/game/rejoin/${game.code}`)
    .set('x-user-id', user.id)
    .expect((res) => {
      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual({ userId: user.id, gameCode: 'ABCD' })
    })
    .end(done)
})

it('tries to re-joins to a not allowed game', (done) => {
  const user = DB.User.create({ name: 'Ramon' })
  const otherUser = DB.User.create({ name: 'Pepe' })
  const game = DB.Game.create(user)
  DB.User.update(user.id, { gameId: game.id, order: 0 })

  request(app)
    .get('/api/game/rejoin/ABCD')
    .set('x-user-id', otherUser.id)
    .expect(403)
    .end(done)
})

it('tries to re-joins to a not found game', (done) => {
  request(app)
    .get('/api/game/rejoin/BBBB')
    .expect(404)
    .end(done)
})
