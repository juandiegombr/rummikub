import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from 'App.js'
import { Socket } from 'services/socket'
import { withNetwork } from './helpers'
import { gameResponse } from './__scenarios__/game'
import { userResponse } from './__scenarios__/user'

it('renders the initial modal', () => {
  render(<App />)

  const dialog = screen.getByDialog('Welcome! 👋')
  expect(
    within(dialog).getByRole('textbox', { name: 'Name:' }),
  ).toBeInTheDocument()
  expect(
    within(dialog).getByRole('textbox', { name: 'Game code:' }),
  ).toBeInTheDocument()
  expect(
    within(dialog).getByRole('button', { name: 'Generate game code' }),
  ).toBeInTheDocument()
  expect(
    within(dialog).getByRole('button', { name: 'Confirm' }),
  ).toBeInTheDocument()
})

it('sends an event after a move', async () => {
  jest.useFakeTimers()
  withNetwork([
    {
      url: '/user/create/',
      responseBody: userResponse,
    },
    {
      url: '/game/AAAA/',
      status: 404,
    },
    {
      url: '/game/create/',
      responseBody: gameResponse,
    },
  ])
  render(<App />)

  userEvent.type(
    screen.getByRole('textbox', { name: 'Name:' }),
    userResponse.name,
  )
  userEvent.type(screen.getByRole('textbox', { name: 'Game code:' }), 'AAAA')
  userEvent.click(screen.getByButton('Confirm'))
  await act(() => {
    return Promise.resolve()
  })
  act(() => {
    jest.advanceTimersToNextTimer()
  })

  expect(
    screen.queryByRole('dialog', { name: 'Welcome! 👋' }),
  ).not.toBeInTheDocument()
  expect(
    screen.getByRole('dialog', { name: '⏳ Waiting for a player' }),
  ).toBeInTheDocument()

  expect(Socket.emit).toHaveBeenCalledWith('game:join', {
    gameCode: 'AAAA',
  })
  jest.useRealTimers()
})
