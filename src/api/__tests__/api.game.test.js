const request = require('supertest')

const DB = require('../../db')
const { app } = require('../../server')
const { Game, User } = require('../../models')

afterEach(() => {
  DB.reset()
})

it('creates a default new game', (done) => {
  const gameCode = 'AAAA'

  request(app)
    .post('/api/game/create/')
    .send({ code: gameCode })
    .expect((res) => {
      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual(
        {
          game: {
            code: gameCode,
            id: expect.any(String),
            rounds: 1,
            turn: 0,
            players: 2,
            points: 50,
          }
        }
      )
      expect(Game.get({ code: gameCode })).toEqual(
        {
          code: gameCode,
          id: expect.any(String),
          rounds: 1,
          turn: 0,
          players: 2,
          points: 50,
          users: expect.any(Array),
          tiles: expect.any(Array),
        }
      )
    })
    .end(done)
})

it('creates a new game', (done) => {
  const gameCode = 'AAAA'

  request(app)
    .post('/api/game/create/')
    .send({ code: gameCode, players: '3', points: '100' })
    .expect((res) => {
      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual(
        {
          game: {
            code: gameCode,
            id: expect.any(String),
            rounds: 1,
            turn: 0,
            players: 3,
            points: 100,
          }
        }
      )
      expect(Game.get({ code: gameCode })).toEqual(
        {
          code: gameCode,
          id: expect.any(String),
          rounds: 1,
          turn: 0,
          players: 3,
          points: 100,
          users: expect.any(Array),
          tiles: expect.any(Array),
        }
      )
    })
    .end(done)
})

it('joins a created game', (done) => {
  const gameCode = 'AAAA'
  Game.create({ code: gameCode })

  request(app)
    .post('/api/game/join/')
    .send({ gameCode })
    .expect((res) => {
      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual(
        {
          game: {
            code: gameCode,
            id: expect.any(String),
            rounds: 1,
            turn: 0,
            players: 2,
            points: 50,
          }
        }
      )
    })
    .end(done)
})

it('tries to joins a not found game', (done) => {
  const gameCode = 'AAAA'
  Game.create({ code: gameCode })

  request(app)
    .post('/api/game/join/')
    .send({ gameCode: 'BBBB' })
    .expect(404)
    .end(done)
})

it('re-joins a created game', (done) => {
  const gameCode = 'AAAA'
  const user = User.create({ name: 'Ramon' })
  const game = Game.create({ code: gameCode })
  User.update(user, { gameId: game.id, order: 0 })

  request(app)
    .post('/api/game/rejoin/')
    .send({ gameCode })
    .set('x-user-id', user.id)
    .expect((res) => {
      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual(
        {
          game: {
            code: gameCode,
            id: expect.any(String),
            rounds: 1,
            turn: 0,
            players: 2,
            points: 50,
          }
        }
      )
    })
    .end(done)
})

it('tries to re-joins to a not allowed game', (done) => {
  const gameCode = 'AAAA'
  const user = User.create({ name: 'Ramon' })
  const otherUser = User.create({ name: 'Pepe' })
  const game = Game.create({ code: gameCode })
  User.update(user, { gameId: game.id, order: 0 })

  request(app)
    .post('/api/game/rejoin/')
    .send({ gameCode })
    .set('x-user-id', otherUser.id)
    .expect(403)
    .end(done)
})

it('tries to re-joins to a not found game', (done) => {
  const gameCode = 'AAAA'
  const user = User.create({ name: 'Ramon' })

  request(app)
    .get('/api/game/rejoin/')
    .send({ gameCode })
    .set('x-user-id', user.id)
    .expect(404)
    .end(done)
})
