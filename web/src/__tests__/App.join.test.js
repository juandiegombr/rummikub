import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from '../App'

it('renders the join dialog', async () => {
  render(<App />)

  userEvent.click(screen.getByButton('Join game'))

  const joinDialog = screen.getByDialog('Join game 🎯')
  expect(joinDialog).toHaveTextContent('Join game 🎯')
  expect(joinDialog).toHaveTextContent('Code:')
  expect(joinDialog).toHaveTextContent('Confirm')
})

it('joins a new game', async () => {
  const blob = new Blob(
    [ JSON.stringify({ code: 'AAAA' }, null, 2) ],
    { type : 'application/json' },
  )
  const options = { status: 200 }
  const response = new Response(blob, options)
  global.fetch = jest.fn(() => Promise.resolve(response))
  render(<App />)

  userEvent.click(screen.getByButton('Join game'))
  userEvent.type(screen.getByLabelText('Code:'), 'AAAA')
  userEvent.click(screen.getByButton('Confirm'))
  await waitForElementToBeRemoved(() => screen.getByDialog('Join game 🎯'))

  expect(screen.queryByDialog('Join game 🎯')).not.toBeInTheDocument()
})
