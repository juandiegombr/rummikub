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
  DB.getGames = jest.fn().mockImplementation(() => ({}))
})

it('creates a new game', (done) => {
  request(app)
    .get('/api/game/create/')
    .expect((res) => {
      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual({ userId: 'uuid', gameCode: 'ABCD' })
      expect(DB.getGames()).toEqual({ 'ABCD': expect.any(Object) })
    })
    .end(done)
})

it('joins a created game', (done) => {
  DB.getGames = jest.fn().mockImplementationOnce(() => {
    return {
      'ABCD': {
        code: 'ABCD',
        tiles: [
          { id: 'id_blue_13', value: 13, color: 'blue' },
          { id: 'id_red_3', value: 3, color: 'red' },
        ],
        grid: {},
        players: {
          1: [],
          2: [],
        },
      }
    }
  })
  request(app)
    .get('/api/game/join/ABCD')
    .expect((res) => {
      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual({ userId: 'uuid', gameCode: 'ABCD' })
    })
    .end(done)
})

it('tries to joins a not found game', (done) => {
  request(app)
    .get('/api/game/join/BBBB')
    .expect(404)
    .end(done)
})

it('re-joins a created game', (done) => {
  DB.getGames = jest.fn().mockImplementationOnce(() => {
    return {
      'ABCD': {
        code: 'ABCD',
        tiles: [
          { id: 'id_blue_13', value: 13, color: 'blue' },
          { id: 'id_red_3', value: 3, color: 'red' },
        ],
        grid: {},
        players: {
          1: [],
          2: [],
        },
      }
    }
  })
  request(app)
    .get('/api/game/join/ABCD')
    .expect((res) => {
      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual({ userId: 'uuid', gameCode: 'ABCD' })
    })
    .end(done)
})

it('tries to re-joins to a not allowed game', (done) => {
  DB.getGames = jest.fn().mockImplementation(() => {
    return {
      'ABCD': {
        code: 'ABCD',
        tiles: [
          { id: 'id_blue_13', value: 13, color: 'blue' },
          { id: 'id_red_3', value: 3, color: 'red' },
        ],
        grid: {},
        players: {
          1: [],
          2: [],
        },
      }
    }
  })

  request(app)
    .get('/api/game/rejoin/ABCD')
    .set('x-user-id', 'other-uuid')
    .expect(403)
    .end(done)
})

it('re-joins a not found game', (done) => {
  request(app)
    .get('/api/game/rejoin/BBBB')
    .expect(404)
    .end(done)
})
