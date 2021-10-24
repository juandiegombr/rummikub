import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Socket } from 'services/socket'
import { Http } from 'services/http'

import './Initialize.css'

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

const Waiting = ({ game }) => {
  return (
    createPortal(
      <div className="initialize-dialog__overlay">
        <div role="dialog" aria-labelledby="initialize-title" className="initialize-dialog">
          <h2 id="initialize-title" className="initialize-dialog__title">⏳ Waiting for a player</h2>
          <p className="initialize-dialog__description">Share the game code to start playing</p>
          <div className="initialize-dialog__code">{game.code}</div>
        </div>
      </div>,
      document.getElementById('dialog'),
    )
  )
}

const Join = ({ confirm }) => {
  const inputRef = useRef()

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  return (
    createPortal(
      <div className="initialize-dialog__overlay">
        <div role="dialog" aria-labelledby="initialize-title" className="initialize-dialog">
          <h2 id="initialize-title" className="initialize-dialog__title">Join game 🎯</h2>
          <form className="initialize-dialog__form" onSubmit={confirm}>
            <div className="ui-input">
              <label htmlFor="code-field" className="ui-input__label">Code:</label>
              <input id="code-field" ref={inputRef} className="ui-input__input" type="text" name="code" placeholder="Write your code here"/>
            </div>
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

const Initialize = ({ game, setGame, setTiles, onMove }) => {
  const [status, setStatus] = useState(STATUS.INIT)

  const createGame = async () => {
    const game = await Http.get('/game/create').then(response => response.json())
    await Http.get(`/game/join/${game.code}`)
    setGame(game)
    setStatus(STATUS.CREATE)
    Socket.emit('game:join', game)
    Socket.setRoom(game)
    Socket.on('user:joined', () => {
      setStatus(null)
    })
    Socket.on('game:start', (tiles) => {
      setTiles(tiles)
    })
    Socket.on('game:move', (move) => {
      /* eslint-disable */ console.log('move', move)
      onMove(move)
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
    setGame(game)
    Socket.emit('game:join', game)
    Socket.setRoom(game)
    Socket.on('game:start', (tiles) => {
      setTiles(tiles)
    })
    Socket.on('game:move', (move) => {
      /* eslint-disable */ console.log('move', move)
      onMove(move)
    })
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
