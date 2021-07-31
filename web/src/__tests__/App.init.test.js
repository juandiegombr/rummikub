import React from 'react'
import { render, screen } from '@testing-library/react'
import App from '../App'
import userEvent from '@testing-library/user-event'

import { io } from 'socket.io-client'

test('renders the initial modal', () => {
  render(<App />)

  const dialog = screen.getByRole('dialog', { name: 'Welcome! 👋' })
  expect(dialog).toHaveTextContent('What do you want to do?')
  expect(dialog).toHaveTextContent('Create game')
  expect(dialog).toHaveTextContent('Join game')
})

test('creates a new game', () => {
  render(<App />)

  userEvent.click(screen.getByButton('Create game'))

  expect(io().emit).toHaveBeenCalledWith('CREATE_GAME')
})

test('joins a new game', () => {
  render(<App />)

  userEvent.click(screen.getByButton('Join game'))

  expect(io().emit).toHaveBeenCalledWith('JOIN_GAME')
})
