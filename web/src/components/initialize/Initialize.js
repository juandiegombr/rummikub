import { useEffect, useState } from 'react'
import { Socket } from 'services/socket'
import { Http } from 'services/http'

import { InitDialog } from './InitDialog'
import { WaitingDialog } from './WaitingDialog'
import { Error } from './Error'
import { GameSummary } from 'components/game-summary'

import './Initialize.css'

const STATUS = {
  INIT: 'init',
  WAITING: 'waiting',
  ERROR: 'error',
}

const Initialize = ({
  setTiles,
  setSelectedTile,
  setPlayers,
  setGrid,
  rounds,
  setRounds,
  setTurn,
}) => {
  const [showRounds, setShowRounds] = useState(false)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    reJoinToGame()
  }, [])

  const initSocketGame = () => {
    Socket.on('game:start', (tiles) => {
      setStatus(null)
      setTiles(tiles)
    })
    Socket.on('game:summary', ({ users, remainingTiles }) => {
      setPlayers(users)
    })
    Socket.on('game:move', (grid) => {
      setGrid(grid)
    })
    Socket.on('game:play:ok', () => {
      setTurn(false)
    })
    Socket.on('game:play:ko', () => {
      setStatus(STATUS.ERROR)
    })
    Socket.on('game:pass:ok', ({ tiles, tile, grid }) => {
      setTiles(tiles)
      setSelectedTile(tile)
      setGrid(grid)
      setTurn(false)
    })
    Socket.on('game:pass:ko', () => {
    })
    Socket.on('game:turn', () => {
      setTurn(true)
    })
    Socket.on('game:finish', (rounds) => {
      setRounds(rounds)
      setShowRounds(true)
    })
  }

  const reJoinToGame = async () => {
    const userId = localStorage.userId
    const gameCode = localStorage.gameCode

    if (userId && gameCode) {
      try {
        const response = await Http.post(`/game/${gameCode}/rejoin/`)
        if (response.status === 404) throw new Error()
        if (response.status === 403) throw new Error()
        Socket.init()
        Socket.emit('game:rejoin', { gameCode })
        initSocketGame()
      } catch (error) {
        setStatus(STATUS.INIT)
        localStorage.clear()
      }
      return
    }

    setStatus(STATUS.INIT)
    localStorage.clear()
  }

  if (status === STATUS.ERROR) {
    return <Error
      onRetry={() => setStatus(null)}
      onPass={() => {
        const spot = { x: 10, y: 1 }
        Socket.emit('game:pass', spot)
        setStatus(null)
      }}
    />
  }

  if (status === STATUS.INIT) {
    return (
      <InitDialog
        onConfirm={() => {
          initSocketGame()
          setStatus(STATUS.WAITING)
        }}
      />
    )
  }

  if (status === STATUS.WAITING) {
    return <WaitingDialog />
  }

  if (showRounds) {
    return <GameSummary rounds={rounds} onConfirm={() => setShowRounds(false)}/>
  }

  return null
}

export { Initialize }
