const request = require('supertest')

const { app } = require('../../server')
const DB = require('../../db')

jest.mock('../../helpers', () => {
  return {
    generateGameCode: jest.fn().mockReturnValue('ABCD')
  }
})

jest.mock('uuid', () => {
  return {
    v4: jest.fn().mockReturnValue('uuid')
  }
})

afterEach(() => {
  DB.reset()
})

it('creates a new game', (done) => {
  request(app)
    .get('/api/game/create/')
    .expect((res) => {
      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual({ userId: 'uuid', gameCode: 'ABCD' })
      expect(DB.getGameByCode('ABCD')).toEqual(
        { code: 'ABCD', id: 'uuid', users: ['uuid'], turn: 'uuid' }
      )
    })
    .end(done)
})

it('joins a created game', (done) => {
  const user = DB.User.create()
  const game = DB.Game.create(user)

  request(app)
    .get(`/api/game/join/${game.code}`)
    .expect((res) => {
      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual({ userId: user.id, gameCode: game.code })
    })
    .end(done)
})

it('tries to joins a not found game', (done) => {
  const user = DB.User.create()
  DB.Game.create(user)

  request(app)
    .get('/api/game/join/BBBB')
    .expect(404)
    .end(done)
})

it('re-joins a created game', (done) => {
  const user = DB.User.create()
  const game = DB.Game.create(user)

  request(app)
    .get(`/api/game/rejoin/${game.code}`)
    .set('x-user-id', user.id)
    .expect((res) => {
      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual({ userId: 'uuid', gameCode: 'ABCD' })
    })
    .end(done)
})

it('tries to re-joins to a not allowed game', (done) => {
  const user = DB.User.create()
  DB.Game.create(user)

  request(app)
    .get('/api/game/rejoin/ABCD')
    .set('x-user-id', 'other-uuid')
    .expect(403)
    .end(done)
})

it('tries to re-joins to a not found game', (done) => {
  request(app)
    .get('/api/game/rejoin/BBBB')
    .expect(404)
    .end(done)
})
