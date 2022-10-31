const { initializeSocketService } = require('../../socket')
const DB = require('../../../db')

jest.mock('../../../services/logger')
DB.getGame = jest.fn().mockImplementation(() => {
  return {
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
})
DB.getPlayerTiles = jest.fn().mockImplementation(() => {
  return [
    { id: 'id_blue_13', value: 13, color: 'blue' },
    { id: 'id_red_3', value: 3, color: 'red' },
  ]
})
DB.getGrid = jest.fn().mockImplementation(() => {
  return {}
})

const SocketServerMock = () => {
  const SOCKETS = {}
  const GLOBAL_EVENTS = {}
  const EVENTS = {}

  const on = (event, callback) => {
    GLOBAL_EVENTS[event] = callback
  }

  return {
    getSockets: () => SOCKETS,
    sockets: {
      sockets: {
        get: (id) => {
          return SOCKETS[id]
        }
      }
    },
    on,
    in: (roomId) => {
      return {
        allSockets: () => {
          const socketsInRoom =  Object.values(SOCKETS).filter((socket) => {
            return socket.roomId === roomId
          })
          return Promise.resolve(socketsInRoom.map(socket => socket.id))
        }
      }
    },
    client: (id) => {
      EVENTS['game:start'] = jest.fn()
      const socketClient =  {
        id,
        roomId: null,
        emit: jest.fn(async (event, payload) => {
          const triggeredEvent = EVENTS[event]
          await triggeredEvent(payload)
        }),
      }
      const socketServer =  {
        id,
        roomId: null,
        on: jest.fn((event, callback) => {
          EVENTS[event] = callback
        }),
        to: (roomId) => {
          SOCKETS[id].roomId = roomId
        },
        emit: jest.fn(),
        join: (roomId) => {
          SOCKETS[id].roomId = roomId
        },
        broadcast: {
          emit: jest.fn()
        },
        handshake: {
          auth: { token: id },
        },
      }
      SOCKETS[id] = socketServer
      const connectionEvent = GLOBAL_EVENTS['connection']
      connectionEvent(socketServer)
      const client = socketClient
      const server = socketServer
      return [ client, server ]
    }
  }
}


it('disconnects from the socket server', function(done) {
  const io = SocketServerMock()
  initializeSocketService(io)
  const [ client, server ] = io.client('1')

  client.emit('disconnect')

  expect(server.broadcast.emit).toHaveBeenCalledWith('LEAVED')
  done()
})

it('joins to a game', async function(done) {
  const io = SocketServerMock()
  initializeSocketService(io)
  const [ client, server ] = io.client('1')

  await client.emit('game:join', { data: { gameCode: 'ABCD' } })

  expect(server.roomId).toBe('room:ABCD')
  expect(server.emit).not.toHaveBeenCalledWith('game:start', expect.any(Array))
  done()
})

it('joins two players to a game', async function(done) {
  const io = SocketServerMock()
  initializeSocketService(io)
  const [ firstClient, firstServer ] = io.client('1')
  await firstClient.emit('game:join', { data: { gameCode: 'ABCD' } })
  const [ secondClient, secondServer ] = io.client('2')
  await secondClient.emit('game:join', { data: { gameCode: 'ABCD' } })

  expect(firstServer.emit).toHaveBeenCalledWith('game:start', expect.any(Array))
  expect(secondServer.emit).toHaveBeenCalledWith('game:start', expect.any(Array))
  done()
})

it('rejoins to a game', async function(done) {
  const io = SocketServerMock()
  initializeSocketService(io)
  const [ firstClient, firstServer ] = io.client('1')
  await firstClient.emit('game:join', { data: { gameCode: 'ABCD' } })
  const [ secondClient, secondServer ] = io.client('2')
  await secondClient.emit('game:join', { data: { gameCode: 'ABCD' } })
  await secondClient.emit('game:rejoin', { room: 'room:ABCD', data: { gameCode: 'ABCD' } })

  expect(firstServer.emit).toHaveBeenCalledWith('game:start', expect.any(Array))
  expect(firstServer.emit).not.toHaveBeenCalledWith('game:move', {})
  expect(secondServer.emit).toHaveBeenCalledWith('game:start', expect.any(Array))
  expect(secondServer.emit).toHaveBeenCalledWith('game:move', {})
  done()
})