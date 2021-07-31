import { io } from 'socket.io-client'

let socket

const init = () => {
  socket = io(
    process.env.REACT_APP_WEBSOCKET_HOST,
    {transports: ['websocket']},
  )
}

const getInstance = () => {
  return socket
}

export const Socket = {
  init,
  getInstance,
}
