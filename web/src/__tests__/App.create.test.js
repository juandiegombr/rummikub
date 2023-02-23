import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SocketServer } from 'setupTests'

import App from 'App.js'
import { Socket } from 'services/socket'

import { withNetwork } from './helpers'
import { hand } from './__scenarios__/scenario'

it('creates a new game', async () => {
  const game = { code: 'AAAA' }
  withNetwork(game)
  render(<App />)

  userEvent.click(screen.getByButton('Create game'))
  const waitingDialog = await screen.findByDialog('⏳ Waiting for a player')

  expect(waitingDialog).toBeInTheDocument()
  expect(waitingDialog).toHaveTextContent(game.code)
  expect(Socket.emit).toHaveBeenCalledWith('game:join', game)
})

it('listens the socket messages after a new player is joined', async () => {
  const game = { code: 'AAAA' }
  withNetwork(game)
  render(<App />)

  userEvent.click(screen.getByButton('Create game'))
  await screen.findByDialog('⏳ Waiting for a player')

  expect('game:start').toBeListening()
  expect('game:move').toBeListening()
})

it('closes the waiting dialog after a new player is joined', async () => {
  const game = { code: 'AAAA' }
  withNetwork(game)
  render(<App />)

  userEvent.click(screen.getByButton('Create game'))
  const waitingDialog = await screen.findByDialog('⏳ Waiting for a player')
  SocketServer.emit('game:start', hand)

  expect(waitingDialog).not.toBeInTheDocument()
})

it('displays the tiles after a new player is joined', async () => {
  const game = { code: 'AAAA' }
  withNetwork(game)
  render(<App />)

  userEvent.click(screen.getByButton('Create game'))
  await screen.findByDialog('⏳ Waiting for a player')
  SocketServer.emit('game:start', hand)

  const tiles = hand.map((tile) => `Tile ${tile.value} ${tile.color}`)
  tiles.forEach(tileLabel => {
    expect(screen.getByLabelText(tileLabel)).toBeInTheDocument()
  })
})
