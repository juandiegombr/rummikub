import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'

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

jest.mock('socket.io-client', () => {
  const socket = {
    on: jest.fn(),
    emit: jest.fn(),
  }
  return {
    io: () => socket
  }
})

beforeEach(() => {
  setupPortal()
})
