import request from 'supertest'

import DB from '../../db'
import { app } from '../../server'

afterEach(() => {
  DB.reset()
})

it('creates a user', (done) => {
  request(app)
    .post('/api/user/create/')
    .send({ name: 'ramon' })
    .expect((res) => {
      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual({
        id: expect.any(String),
        name: 'ramon',
        isFirstMove: true,
        gameId: null,
        order: null,
        socketId: null,
        tiles: [],
      })
    })
    .end(done)
})
