import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from '../App'
import { Http } from 'services/http'

it('joins a new game', async () => {
  const blob = new Blob(
    [ JSON.stringify(null, null, 2) ],
    { type : 'application/json' },
  )
  const options = { status: 200 }
  const response = new Response(blob, options)
  Http.get = jest.fn().mockResolvedValue(response)
  render(<App />)

  const dialog = screen.getByDialog('Welcome! 👋')
  userEvent.click(screen.getByButton('Join game'))
  await waitForElementToBeRemoved(() => screen.getByDialog('Welcome! 👋'))

  expect(dialog).not.toBeInTheDocument()
})
