const request = require('supertest')

const { app } = require('../../server')
const DB = require('../../db')

jest.mock('uuid', () => {
  return {
    v4: jest.fn().mockReturnValue('uuid')
  }
})

afterEach(() => {
  DB.reset()
})

it('creates a user', (done) => {
  request(app)
    .get('/api/user/ramon')
    .expect((res) => {
      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual({ id: 'uuid', name: 'ramon', socketId: null })
    })
    .end(done)
})
