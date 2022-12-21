import '@testing-library/jest-dom'
import { act, screen } from '@testing-library/react'

const setupPortal = () => {
  const portalRootId = 'dialog'
  if (document.getElementById(portalRootId)) {
    return
  }

  const portalRoot = document.createElement('div')
  portalRoot.setAttribute('id', portalRootId)
  document.body.appendChild(portalRoot)
}

screen.getByButton = (name) => {
  return screen.getByRole('button', { name })
}

screen.findByButton = (name) => {
  return screen.findByRole('button', { name })
}

screen.getByDialog = (name) => {
  return screen.getByRole('dialog', { name })
}

screen.queryByDialog = (name) => {
  return screen.queryByRole('dialog', { name })
}

screen.findByDialog = (name) => {
  return screen.findByRole('dialog', { name })
}

export let events = {}

export const SocketServer = {
  emit: (event, ...args) => {
    act(() => events[event](...args))
  },
}

jest.mock('socket.io-client', () => {
  const socket = {
    emit: jest.fn(),
    on: (event, callback) => {
      events[event] = callback
    },
  }
  return {
    io: () => socket,
  }
})

jest.mock('services/socket', () => {
  const originalModule = jest.requireActual('services/socket')
  return {
    Socket: {
      ...originalModule.Socket,
      emit: jest.spyOn(originalModule.Socket, 'emit'),
    },
  }
})

beforeEach(() => {
  setupPortal()
})

const toBeListening = (eventName) => {
  const event = events[eventName]
  if (!event) {
    return {
      pass: false,
      message: () => `📡 Socket: The event ${eventName} is not being listened.`,
    }
  }
  return {
    pass: true,
    message: () => null,
  }
}

expect.extend({ toBeListening })
