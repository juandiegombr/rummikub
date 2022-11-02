
const SocketServerMock = () => {
  const SOCKETS = {}
  const GLOBAL_EVENTS = {}

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
    client: (socketId, { userId }) => {
      const EVENTS = {}
      EVENTS['game:start'] = jest.fn()
      const socketClient =  {
        id: socketId,
        roomId: null,
        emit: jest.fn(async (event, payload) => {
          const triggeredEvent = EVENTS[event]
          await triggeredEvent(payload)
        }),
      }
      const socketServer =  {
        id: socketId,
        roomId: null,
        on: jest.fn((event, callback) => {
          EVENTS[event] = callback
        }),
        to: (roomId) => {
          SOCKETS[socketId].roomId = roomId
          return {
            emit: jest.fn()
          }
        },
        emit: jest.fn(),
        join: (roomId) => {
          SOCKETS[socketId].roomId = roomId
        },
        broadcast: {
          emit: jest.fn()
        },
        handshake: {
          auth: { token: userId },
        },
      }
      SOCKETS[socketId] = socketServer
      const connectionEvent = GLOBAL_EVENTS['connection']
      connectionEvent(socketServer)
      const client = socketClient
      const server = socketServer
      return [ client, server ]
    }
  }
}

module.exports = SocketServerMock
