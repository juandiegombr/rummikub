import { io } from 'socket.io-client'

let socket

const init = () => {
  socket = io(
    process.env.REACT_APP_WEBSOCKET_HOST,
    { transports: ['websocket'] },
  )
}

const getInstance = () => {
  return socket
}

const on = (...args) => {
  return getInstance().on(...args)
}

const emit = (...args) => {
  return getInstance().emit(...args)
}

export const Socket = {
  init,
  on,
  emit,
}
