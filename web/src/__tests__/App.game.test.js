import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SocketServer } from 'setupTests'

import App from 'App.js'
import { Socket } from 'services/socket'

import { withNetwork } from './helpers'
import { hand } from './__scenarios__/scenario'

it('sends an event after a move', async () => {
  const game = { code: 'AAAA' }
  withNetwork(game)
  render(<App />)

  userEvent.click(screen.getByButton('Create game'))
  await screen.findByDialog('⏳ Waiting for a player')
  SocketServer.emit('game:start', hand)
  userEvent.click(screen.getByLabelText('Tile 12 black'))
  userEvent.click(screen.getByLabelText('Spot 0 0'))

  expect(Socket.emit).toHaveBeenCalledWith(
    'game:move',
    {
      tile: { id: 'id_black_12', value: 12, color: 'black' },
      spot: { x: 0, y: 0 },
    },
  )
})

it('displays the moved tile', async () => {
  const game = { code: 'AAAA' }
  const grid = {
    'id_blue_1': {
      tile: { id: 'id_blue_1', value: 1, color: 'blue' },
      spot: { x: 0, y: 0 },
    },
  }
  withNetwork(game)
  render(<App />)

  userEvent.click(screen.getByButton('Create game'))
  await screen.findByDialog('⏳ Waiting for a player')
  SocketServer.emit('game:start', hand)
  SocketServer.emit('game:move', grid)

  expect(screen.getByLabelText('Tile 1 blue')).toBeInTheDocument()
})
