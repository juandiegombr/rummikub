const { initializeSocketService } = require('../../socket')

jest.mock('../../../services/logger')
jest.mock('../../../db', () => {
  const game = {
    code: 'ABCD',
    tiles: [
      { id: 'id_blue_13', value: 13, color: 'blue' },
      { id: 'id_red_3', value: 3, color: 'red' },
      { id: 'id_orange_13', value: 13, color: 'orange' },
      { id: 'id_orange_10', value: 10, color: 'orange' },
      { id: 'id_black_5', value: 5, color: 'black' },
      { id: 'id_blue_9', value: 9, color: 'blue' },
      { id: 'id_orange_6', value: 6, color: 'orange' },
      { id: 'id_black_6', value: 6, color: 'black' },
      { id: 'id_black_10', value: 10, color: 'black' },
      { id: 'id_black_12', value: 12, color: 'black' },
      { id: 'id_orange_1', value: 1, color: 'orange' },
      { id: 'id_blue_11', value: 11, color: 'blue' },
      { id: 'id_red_12', value: 12, color: 'red' },
      { id: 'id_black_2', value: 2, color: 'black' },
      { id: 'id_black_13', value: 13, color: 'black' },
      { id: 'id_red_10', value: 10, color: 'red' },
      { id: 'id_red_5', value: 5, color: 'red' },
      { id: 'id_red_9', value: 9, color: 'red' },
      { id: 'id_orange_4', value: 4, color: 'orange' },
      { id: 'id_blue_7', value: 7, color: 'blue' },
      { id: 'id_orange_8', value: 8, color: 'orange' },
      { id: 'id_red_4', value: 4, color: 'red' },
      { id: 'id_blue_6', value: 6, color: 'blue' },
      { id: 'id_red_1', value: 1, color: 'red' },
      { id: 'id_black_1', value: 1, color: 'black' },
      { id: 'id_red_13', value: 13, color: 'red' },
      { id: 'id_red_2', value: 2, color: 'red' },
      { id: 'id_black_11', value: 11, color: 'black' },
      { id: 'id_orange_9', value: 9, color: 'orange' },
      { id: 'id_black_4', value: 4, color: 'black' },
      { id: 'id_black_3', value: 3, color: 'black' },
      { id: 'id_orange_5', value: 5, color: 'orange' },
      { id: 'id_orange_2', value: 2, color: 'orange' },
      { id: 'id_blue_3', value: 3, color: 'blue' },
      { id: 'id_orange_3', value: 3, color: 'orange' },
      { id: 'id_blue_4', value: 4, color: 'blue' },
      { id: 'id_blue_10', value: 10, color: 'blue' },
      { id: 'id_orange_12', value: 12, color: 'orange' },
      { id: 'id_black_8', value: 8, color: 'black' },
      { id: 'id_blue_1', value: 1, color: 'blue' },
      { id: 'id_red_11', value: 11, color: 'red' },
      { id: 'id_orange_11', value: 11, color: 'orange' },
      { id: 'id_blue_12', value: 12, color: 'blue' },
      { id: 'id_black_7', value: 7, color: 'black' },
      { id: 'id_red_6', value: 6, color: 'red' },
      { id: 'id_blue_8', value: 8, color: 'blue' },
      { id: 'id_orange_7', value: 7, color: 'orange' },
      { id: 'id_blue_2', value: 2, color: 'blue' },
      { id: 'id_red_8', value: 8, color: 'red' },
      { id: 'id_blue_5', value: 5, color: 'blue' },
      { id: 'id_red_7', value: 7, color: 'red' },
      { id: 'id_black_9', value: 9, color: 'black' }
    ],
    grid: {},
  }
  return {
    GAMES: { 'ABCD': game }

  }
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