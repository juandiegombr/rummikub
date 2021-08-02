import { render, screen } from '@testing-library/react'

import App from '../App'

it('renders the initial modal', () => {
  render(<App />)

  const dialog = screen.getByDialog('Welcome! 👋')
  expect(dialog).toHaveTextContent('What do you want to do?')
  expect(dialog).toHaveTextContent('Create game')
  expect(dialog).toHaveTextContent('Join game')
})
