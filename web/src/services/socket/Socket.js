import { io } from 'socket.io-client'

let socket
let config = {}

const init = () => {
  socket = io(
    process.env.REACT_APP_WEBSOCKET_HOST,
    {
      transports: ['websocket'],
      auth: (cb) => {
        cb({ token: localStorage.userId })
      },
    },
  )
}

const setRoom = (game) => {
  config.room = `room:${game.code}`
}

const getInstance = () => {
  return socket
}

const getId = () => {
  return getInstance().id
}

const on = (...args) => {
  return getInstance().on(...args)
}

const emit = (event, data) => {
  if (config.room) {
    return getInstance().emit(event, { room: config.room, data })
  }
  return getInstance().emit(event, { data })
}

const reconnect = () => {
  socket.auth.token = localStorage.userId
  socket.disconnect().connect()
}

export const Socket = {
  init,
  reconnect,
  getId,
  on,
  emit,
  setRoom,
}
