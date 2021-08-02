import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Socket } from 'services/socket'
import { Http } from 'services/http'

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

const Join = ({ confirm }) => {
  return (
    createPortal(
      <div className="initialize-dialog__overlay">
        <div role="dialog" aria-labelledby="initialize-title" className="initialize-dialog">
          <h2 id="initialize-title" className="initialize-dialog__title">Join game 🎯</h2>
          <p className="initialize-dialog__description">What do you want to do?</p>
          <form onSubmit={confirm}>
            <label>
              <span>Code:</span>
              <input type="text" name="code"/>
            </label>
            <button className="ui-button" type="submit">Confirm</button>
          </form>
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
    const game = await Http.get('/game/create').then(response => response.json())
    await Http.get(`/game/join/${game.code}`)
    setGame(game)
    setStatus(STATUS.CREATE)
    Socket.emit('game:join', game)
    Socket.on('user:joined', (data) => {
      setStatus(null)
    })
  }

  const joinGame = async () => {
    setStatus(STATUS.JOIN)
  }

  const confirmJoin = async (event) => {
    event.preventDefault()
    const cuvoForm = new FormData(event.target)
    const formElements = Object.fromEntries(cuvoForm)
    const response = await Http
      .get(`/game/join/${formElements.code}`)
    if (response.status === 404) {
      return
    }
    const game = await response.json()
    Socket.emit('game:join', game)
    setStatus(null)
  }

  if (status === STATUS.INIT) {
    return <FirstStep create={createGame} join={joinGame} />
  }

  if (status === STATUS.JOIN) {
    return <Join confirm={confirmJoin} />
  }

  if (status === STATUS.CREATE) {
    return <Waiting game={game}/>
  }

  return null
}

export { Initialize }
