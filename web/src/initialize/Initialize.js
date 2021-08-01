import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Http } from 'services/http'
import { Socket } from 'services/socket'

import './Initialize.css'

const Waiting = ({ game }) => {
  return (
    createPortal(
      <div className="initialize-dialog__overlay">
        <div role="dialog" aria-labelledby="initialize-title" className="initialize-dialog">
          <h2 id="initialize-title" className="initialize-dialog__title">Waiting for a player...</h2>
          <p className="initialize-dialog__description">{game.code}</p>
        </div>
      </div>,
      document.getElementById('dialog'),
    )
  )
}

const FirstStep = ({ create, join }) => {
  return (
    createPortal(
      <div className="initialize-dialog__overlay">
        <div role="dialog" aria-labelledby="initialize-title" className="initialize-dialog">
          <h2 id="initialize-title" className="initialize-dialog__title">Welcome! 👋</h2>
          <p className="initialize-dialog__description">What do you want to do?</p>
          <div className="initialize-dialog__actions">
            <button className="ui-button" onClick={create}>Create game</button>
            <button className="ui-button" onClick={join}>Join game</button>
          </div>
        </div>
      </div>,
      document.getElementById('dialog'),
    )
  )
}

const STATUS = {
  INIT: 'init',
  CREATE: 'create',
  JOIN: 'join',
}

const Initialize = () => {
  const [status, setStatus] = useState(STATUS.INIT)
  const [game, setGame] = useState()

  const createGame = async () => {
    const game = await Http
      .get('/game/create')
      .then(response => response.json())
    Socket.on(`game:join:${game.code}`, () => {
      setStatus(null)
    })
    setGame(game)
    setStatus(STATUS.CREATE)
  }

  const joinGame = async (gameCode = 'AAAA') => {
    try {
      await Http
        .get(`/game/join/${gameCode}`)
        .then(response => response.json())
      setStatus(STATUS.JOIN)
    } catch (error) {
    }
  }

  if (status === STATUS.INIT) {
    return <FirstStep create={createGame} join={joinGame} />
  }

  if (status === STATUS.CREATE) {
    return <Waiting game={game}/>
  }

  return null
}

export { Initialize }
