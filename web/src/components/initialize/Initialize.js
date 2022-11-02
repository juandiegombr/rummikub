import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Socket } from 'services/socket'
import { Http } from 'services/http'

import './Initialize.css'

const NameStep = ({ confirm }) => {
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
              <label htmlFor="name-field" className="ui-input__label">Name:</label>
              <input id="name-field" ref={inputRef} className="ui-input__input" type="text" name="name" placeholder="Write your name here"/>
            </div>
            <button className="ui-button" type="submit">Confirm</button>
          </form>
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

const Waiting = ({ gameCode }) => {
  return (
    createPortal(
      <div className="initialize-dialog__overlay">
        <div role="dialog" aria-labelledby="initialize-title" className="initialize-dialog">
          <h2 id="initialize-title" className="initialize-dialog__title">⏳ Waiting for a player</h2>
          <p className="initialize-dialog__description">Share the game code to start playing</p>
          <div className="initialize-dialog__code">{gameCode}</div>
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
  NAME: 'name',
  INIT: 'init',
  CREATE: 'create',
  JOIN: 'join',
}

const Initialize = ({ setTiles, setUsers, setTurn, onMove }) => {
  const [status, setStatus] = useState(null)

  useEffect(() => {
    const userId = localStorage.userId
    const gameCode = localStorage.gameCode

    if (userId && gameCode) {
      return reJoinToGame(gameCode)
    }

    setStatus(STATUS.NAME)
    localStorage.clear()
  }, [])

  const createUser = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const name = formData.get('name')
    const user = await Http.get(`/user/${name}`).then(response => response.json())
    localStorage.setItem('userId', user.id)
    localStorage.setItem('userName', user.name)
    setStatus(STATUS.INIT)
  }

  const listenToGameEvents = () => {
    Socket.on('game:start', ({ tiles, users }) => {
      setStatus(null)
      setTiles(tiles)
      setUsers(users)
    })
    Socket.on('game:move', (move) => {
      onMove(move)
    })
    Socket.on('game:pass', (tile) => {
      setTiles((tiles) => {
        return [...tiles, tile]
      })
    })
    Socket.on('game:turn', () => {
      setTurn(true)
    })
  }

  const createGame = async () => {
    const { gameCode } = await Http.get('/game/create').then(response => response.json())
    localStorage.setItem('gameCode', gameCode)
    setStatus(STATUS.CREATE)
    Socket.reconnect()
    Socket.emit('game:join', { gameCode })
    listenToGameEvents()
  }

  const joinGame = async () => {
    setStatus(STATUS.JOIN)
  }

  const joinToGame = async (gameCodeInput) => {
    const response = await Http
      .get(`/game/join/${gameCodeInput}`)
    if (response.status === 404) {
      return
    }
    const { gameCode } = await response.json()
    localStorage.setItem('gameCode', gameCode)
    Socket.reconnect()
    Socket.emit('game:join', { gameCode })
    listenToGameEvents()
    setStatus(null)
  }

  const reJoinToGame = async (gameCode) => {
    try {
      const response = await Http.get(`/game/rejoin/${gameCode}`)
      if (response.status === 404) throw new Error()
      if (response.status === 403) throw new Error()
      Socket.emit('game:rejoin', { gameCode })
      listenToGameEvents()
    } catch (error) {
      setStatus(STATUS.NAME)
      localStorage.clear()
    }
  }

  const confirmJoin = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const gameCode = formData.get('code')

    return joinToGame(gameCode)
  }

  if (status === STATUS.NAME) {
    return <NameStep confirm={createUser} />
  }

  if (status === STATUS.INIT) {
    return <FirstStep create={createGame} join={joinGame} />
  }

  if (status === STATUS.JOIN) {
    return <Join confirm={confirmJoin} />
  }

  if (status === STATUS.CREATE) {
    return <Waiting gameCode={localStorage.gameCode}/>
  }

  return null
}

export { Initialize }
