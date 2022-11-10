import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Http } from 'services/http'
import { Socket } from 'services/socket'

const values = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

const generateGameCode = () => {
  const getRandomIndex = () => (Math.random() * values.length).toFixed()
  return Array.from({ length: 4 }).map(() => {
    return values[getRandomIndex()]
  }).join('')
}

const InitDialog = ({ onConfirm }) => {
  const nameRef = useRef()
  const codeRef = useRef()

  useEffect(() => {
    nameRef.current.focus()
  }, [])

  const onSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const name = formData.get('name')
    const gameCode = formData.get('game-code')

    await createUser({ name })
    await joinOrCreateGame({ gameCode })
    localStorage.setItem('gameCode', gameCode)
    Socket.init()
    Socket.emit('game:join', { gameCode })
    onConfirm()
  }

  const createUser = async ({ name }) => {
    const options = {
      body: JSON.stringify({ name }),
    }
    const user = await Http.post('/user/create/', options).then(response => response.json())
    localStorage.setItem('userId', user.id)
    return user
  }

  const joinOrCreateGame = async ({ gameCode }) => {
    const response = await Http.get(`/game/${gameCode}/`)
    if (response.status === 404) {
      return createGame({ gameCode })
    }
    return joinGame({ gameCode })
  }

  const createGame = ({ gameCode }) => {
    const options = {
      body: JSON.stringify({ gameCode }),
    }
    return Http.post('/game/create/', options).then(response => response.json())
  }

  const joinGame = ({ gameCode }) => {
    const options = {
      body: JSON.stringify({ gameCode }),
    }
    return Http.post(`/game/join/`, options)
  }

  const generateCode = () => {
    codeRef.current.value = generateGameCode()
  }

  return (
    createPortal(
      <div className="initialize-dialog__overlay">
        <div role="dialog" aria-labelledby="initialize-title" className="initialize-dialog">
          <h2 id="initialize-title" className="initialize-dialog__title">Welcome! 👋</h2>
          <form className="initialize-dialog__form" onSubmit={onSubmit}>
            <div className="ui-input">
              <label htmlFor="name-field" className="ui-input__label">Name:</label>
              <input id="name-field" ref={nameRef} className="ui-input__input" type="text" name="name" placeholder="Write your name here"/>
            </div>
            <div className="ui-input">
              <label htmlFor="game-code-field" className="ui-input__label">Game code:</label>
              <input id="game-code-field" ref={codeRef} className="ui-input__input" type="text" name="game-code" placeholder="Write your code here"/>
              <button aria-label="Generate game code" className="code-button ui-button ui-button--icon" type="button" onClick={generateCode}></button>
            </div>
            <button className="ui-button" type="submit">Confirm</button>
          </form>
        </div>
      </div>,
      document.getElementById('dialog'),
    )
  )
}

export { InitDialog }
