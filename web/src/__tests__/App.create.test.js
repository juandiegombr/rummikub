import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SocketServer } from 'setupTests'

import App from 'App.js'

it('creates a new game', async () => {
  const blob = new Blob(
    [ JSON.stringify({ code: 'AAAA' }, null, 2) ],
    { type : 'application/json' },
  )
  const options = { status: 200 }
  const response = new Response(blob, options)
  global.fetch = jest.fn(() => Promise.resolve(response))
  render(<App />)

  userEvent.click(screen.getByButton('Create game'))
  const waitingDialog = await screen.findByDialog('Waiting for a player...')

  expect(waitingDialog).toBeInTheDocument()
  expect(waitingDialog).toHaveTextContent('AAAA')
})

it('closes the waiting dialog after a new player is joined', async () => {
  const blob = new Blob(
    [ JSON.stringify({ code: 'AAAA' }, null, 2) ],
    { type : 'application/json' },
  )
  const options = { status: 200 }
  const response = new Response(blob, options)
  global.fetch = jest.fn(() => Promise.resolve(response))
  render(<App />)

  userEvent.click(screen.getByButton('Create game'))
  const waitingDialog = await screen.findByDialog('Waiting for a player...')
  SocketServer.emit('user:joined')

  expect(waitingDialog).not.toBeInTheDocument()
})
