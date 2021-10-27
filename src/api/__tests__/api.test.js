const request = require('supertest')

const { app } = require('../../server')

jest.mock('../../helpers', () => {
  return {
    generateGameCode: jest.fn().mockReturnValue('AAAA')
  }
})

it('creates a new game', (done) => {
  request(app)
    .get('/api/game/create/')
    .expect((res) => {
      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual({ code: 'AAAA' })
    })
    .end(done)
})

it('joins a not found game', (done) => {
  request(app)
    .get('/api/game/join/BBBB')
    .expect(404)
    .end(done)
})

it('joins a created game', (done) => {
  request(app)
    .get('/api/game/join/AAAA')
    .expect((res) => {
      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual({ code: 'AAAA' })
    })
    .end(done)
})
