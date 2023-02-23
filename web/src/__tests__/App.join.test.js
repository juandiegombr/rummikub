import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SocketServer } from 'setupTests'

import App from 'App.js'
import { Socket } from 'services/socket'

import { withNetwork } from './helpers'
import { hand } from './__scenarios__/scenario'

it('renders the join dialog', async () => {
  render(<App />)

  userEvent.click(screen.getByButton('Join game'))

  const joinDialog = screen.getByDialog('Join game 🎯')
  expect(joinDialog).toHaveTextContent('Join game 🎯')
  expect(joinDialog).toHaveTextContent('Code:')
  expect(joinDialog).toHaveTextContent('Confirm')
})

it('joins a new game', async () => {
  const game = { code: 'AAAA' }
  withNetwork(game)
  render(<App />)

  userEvent.click(screen.getByButton('Join game'))
  userEvent.type(screen.getByLabelText('Code:'), game.code)
  userEvent.click(screen.getByButton('Confirm'))
  await waitForElementToBeRemoved(() => screen.getByDialog('Join game 🎯'))

  expect(screen.queryByDialog('Join game 🎯')).not.toBeInTheDocument()
  expect(Socket.emit).toHaveBeenCalledWith('game:join', game)
  expect('game:start').toBeListening()
  expect('game:move').toBeListening()
})

it('displays the tiles after joining a game', async () => {
  const game = { code: 'AAAA' }
  withNetwork(game)
  render(<App />)

  userEvent.click(screen.getByButton('Join game'))
  userEvent.type(screen.getByLabelText('Code:'), game.code)
  userEvent.click(screen.getByButton('Confirm'))
  await waitForElementToBeRemoved(() => screen.getByDialog('Join game 🎯'))
  SocketServer.emit('game:start', hand)

  const tiles = hand.map((tile) => `Tile ${tile.value} ${tile.color}`)
  tiles.forEach(tileLabel => {
    expect(screen.getByLabelText(tileLabel)).toBeInTheDocument()
  })
})
