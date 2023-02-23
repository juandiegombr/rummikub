import { jest } from '@jest/globals'

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
        },
      },
    },
    on,
    in: (room) => {
      return {
        allSockets: () => {
          const socketsInRoom = Object.values(SOCKETS).filter((socket) => {
            return socket.room === room
          })
          return Promise.resolve(socketsInRoom.map((socket) => socket.id))
        },
      }
    },
    client: (socketId, { userId }) => {
      const EVENTS = {}
      EVENTS['game:start'] = jest.fn()
      const socketClient = {
        id: socketId,
        room: null,
        emit: jest.fn(async (event, payload) => {
          const triggeredEvent = EVENTS[event]
          await triggeredEvent(payload)
        }),
      }
      const socketServer = {
        id: socketId,
        room: null,
        on: jest.fn((event, callback) => {
          EVENTS[event] = callback
        }),
        to: (room) => {
          SOCKETS[socketId].room = room
          return {
            emit: jest.fn(),
          }
        },
        emit: jest.fn(),
        join: (room) => {
          SOCKETS[socketId].room = room
        },
        broadcast: {
          emit: jest.fn(),
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
      return [client, server]
    },
  }
}

export default SocketServerMock
