import { io } from 'socket.io-client'

import { Storage } from 'services/storage'

let socket
let config = {}

const getConfig = () => {
  return {
    ...config,
    gameCode: Storage.get('gameCode'),
  }
}

const init = () => {
  socket = io(
    process.env.REACT_APP_WEBSOCKET_HOST,
    {
      transports: ['websocket'],
      auth: (cb) => {
        cb({ token: Storage.get('userId') })
      },
    },
  )
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
  const config = getConfig()
  if (config.gameCode) {
    return getInstance().emit(
      event,
      { gameCode: config.gameCode, data },
    )
  }
  return getInstance().emit(event, { data })
}

const reconnect = () => {
  socket.auth.token = Storage.get('userId')
  socket.disconnect().connect()
}

export const Socket = {
  init,
  reconnect,
  getId,
  on,
  emit,
}
