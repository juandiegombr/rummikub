import { useEffect, useState } from 'react'
import { Socket } from 'services/socket'
import { Http } from 'services/http'

import { Error } from './Error'
import { NameStep } from './NameStep'
import { FirstStep } from './FirstStep'
import { JoinStep } from './JoinStep'
import { WaitingStep } from './WaitingStep'

import './Initialize.css'

const STATUS = {
  NAME: 'name',
  INIT: 'init',
  CREATE: 'create',
  JOIN: 'join',
  ERROR: 'error',
}

const Initialize = ({
  setTiles,
  setSelectedTile,
  setPlayers,
  setGrid,
  setRounds,
  setTurn,
}) => {
  const [status, setStatus] = useState(null)

  useEffect(() => {
    Socket.init()
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
    })
  }

  const reJoinToGame = async () => {
    const userId = localStorage.userId
    const gameCode = localStorage.gameCode

    if (userId && gameCode) {
      try {
        const response = await Http.get(`/game/rejoin/${gameCode}`)
        if (response.status === 404) throw new Error()
        if (response.status === 403) throw new Error()
        Socket.emit('game:rejoin', { gameCode })
        initSocketGame()
      } catch (error) {
        setStatus(STATUS.NAME)
        localStorage.clear()
      }
      return
    }

    setStatus(STATUS.NAME)
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

  if (status === STATUS.NAME) {
    return <NameStep onConfirm={() => setStatus(STATUS.INIT)} />
  }

  if (status === STATUS.INIT) {
    return <FirstStep
      onCreate={() => {
        initSocketGame()
        setStatus(STATUS.CREATE)
      }}
      onJoin={() => setStatus(STATUS.JOIN)}
    />
  }

  if (status === STATUS.JOIN) {
    return <JoinStep onConfirm={() => {
      initSocketGame()
      setStatus(null)
    }} />
  }

  if (status === STATUS.CREATE) {
    return <WaitingStep />
  }

  return null
}

export { Initialize }
