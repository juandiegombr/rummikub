const { initializeSocketService } = require('../../socket')

jest.mock('../../../services/logger')

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
        on: (event, callback) => {
          EVENTS[event] = callback
        },
        to: (roomId) => {
          SOCKETS[id].roomId = roomId
        },
        emit: jest.fn(async (event, payload) => {
          const triggeredEvent = EVENTS[event]
          await triggeredEvent(payload)
        }),
        join: (roomId) => {
          SOCKETS[id].roomId = roomId
        },
        broadcast: {
          emit: jest.fn()
        },
      }
      SOCKETS[id] = socketClient
      const connectionEvent = GLOBAL_EVENTS['connection']
      connectionEvent(socketClient)
      return socketClient
    }
  }
}


it('disconnects from the socket server', function(done) {
  const io = SocketServerMock()
  initializeSocketService(io)
  const socketClient = io.client('1')

  socketClient.emit('disconnect')

  expect(socketClient.broadcast.emit).toHaveBeenCalledWith('LEAVED')
  done()
})

it('joins to a game', async function(done) {
  const io = SocketServerMock()
  initializeSocketService(io)
  const firstPlayer = io.client('1')

  await firstPlayer.emit('game:join', { data: { code:'ABCD' }})

  expect(firstPlayer.roomId).toBe('room:ABCD')
  expect(firstPlayer.emit).not.toHaveBeenCalledWith('game:start', expect.any(Array))
  done()
})

it('joins two players to a game', async function(done) {
  const io = SocketServerMock()
  initializeSocketService(io)
  const firstPlayer = io.client('1')
  await firstPlayer.emit('game:join', { data: { code:'ABCD' }})
  const secondPlayer = io.client('2')
  await secondPlayer.emit('game:join', { data: { code:'ABCD' }})

  expect(firstPlayer.emit).toHaveBeenCalledWith('game:start', expect.any(Array))
  expect(secondPlayer.emit).toHaveBeenCalledWith('game:start', expect.any(Array))
  done()
})