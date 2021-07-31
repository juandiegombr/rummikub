import React from 'react'
import { render, screen } from '@testing-library/react'
import App from '../App'

const setupPortal = () => {
  const portalRootId = 'dialog'
  if (document.getElementById(portalRootId)) {
    return
  }

  const portalRoot = document.createElement('div')
  portalRoot.setAttribute('id', portalRootId)
  document.body.appendChild(portalRoot)
}

beforeEach(() => {
  setupPortal()
})

test('renders the initial modal', () => {
  render(<App />)

  const dialog = screen.getByRole('dialog', { name: 'Welcome! 👋' })
  expect(dialog).toHaveTextContent('What do you want to do?')
  expect(dialog).toHaveTextContent('Create game')
  expect(dialog).toHaveTextContent('Join game')
})
