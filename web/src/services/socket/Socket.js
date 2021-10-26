import { io } from 'socket.io-client'

let socket
let config = {}

const init = () => {
  socket = io(
    process.env.REACT_APP_WEBSOCKET_HOST,
    { transports: ['websocket'] },
  )
}

const setRoom = (game) => {
  config.room = `room:${game.code}`
}

const getInstance = () => {
  return socket
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

export const Socket = {
  init,
  on,
  emit,
  setRoom,
}
