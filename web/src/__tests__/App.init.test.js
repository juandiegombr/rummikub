import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from '../App'

it('renders the initial modal', () => {
  render(<App />)

  const dialog = screen.getByDialog('Welcome! 👋')
  expect(dialog).toHaveTextContent('What do you want to do?')
  expect(dialog).toHaveTextContent('Create game')
  expect(dialog).toHaveTextContent('Join game')
})

it('joins a new game', () => {
  render(<App />)

  userEvent.click(screen.getByButton('Join game'))

  expect(io().emit).toHaveBeenCalledWith('JOIN_GAME')
})
