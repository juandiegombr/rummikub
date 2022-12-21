import { useEffect, useState } from 'react'

import { GameSummary } from 'components/game-summary'
import { Audio } from 'services/audio'
import { Http } from 'services/http'
import { Socket } from 'services/socket'
import { useStorage } from 'services/storage'

import './Initialize.css'

import { Error } from './Error'
import { InitDialog } from './InitDialog'
import { WaitingDialog } from './WaitingDialog'

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
  const Storage = useStorage()

  useEffect(() => {
    reJoinToGame()
  }, [])

  useEffect(() => {
    if (!Storage.get('userId') || !Storage.get('gameCode')) {
      reset()
    }
  }, [Storage])

  const initSocketGame = (animation) => {
    Socket.on('game:start', (tiles) => {
      if (animation) {
        clearTimeout(animation)
      }
      setStatus(null)
      setTiles(tiles)
      setGrid([])
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
    Socket.on('game:pass:ko', () => {})
    Socket.on('game:turn', () => {
      Audio.play(Audio.TURN)
      setTurn(true)
    })
    Socket.on('game:finish', (rounds) => {
      setRounds(rounds)
      setShowRounds(true)
    })
  }

  const reJoinToGame = async () => {
    const userId = Storage.get('userId')
    const gameCode = Storage.get('gameCode')

    if (userId && gameCode) {
      try {
        const options = {
          body: JSON.stringify({ gameCode }),
        }
        const response = await Http.post('/game/rejoin/', options)
        if (response.status === 404) throw new Error()
        if (response.status === 403) throw new Error()
        Socket.init()
        Socket.emit('game:rejoin', { gameCode })
        initSocketGame()
      } catch (error) {
        setStatus(STATUS.INIT)
        Storage.clear()
      }
      return
    }

    setStatus(STATUS.INIT)
    Storage.clear()
  }

  const confirmRound = () => {
    setShowRounds(false)
    Socket.emit('game:round:confirm')
  }

  const reset = () => {
    setPlayers([])
    setTiles([])
    setGrid([])
    setSelectedTile(null)
    setTurn(false)
    setRounds([])
    setStatus(STATUS.INIT)
  }

  return (
    <>
      {status === STATUS.WAITING && (
        <Error
          onRetry={() => setStatus(null)}
          onPass={() => {
            const spot = { x: 10, y: 1 }
            Socket.emit('game:pass', spot)
            setStatus(null)
          }}
        />
      )}
      <GameSummary show={showRounds} rounds={rounds} onConfirm={confirmRound} />
      <WaitingDialog show={status === STATUS.WAITING} />
      <InitDialog
        show={status === STATUS.INIT}
        onConfirm={() => {
          const animation = setTimeout(() => {
            setStatus(STATUS.WAITING)
          }, 1000)
          initSocketGame(animation)
          setStatus(null)
        }}
      />
    </>
  )
}

export { Initialize }
