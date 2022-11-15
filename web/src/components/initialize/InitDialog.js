import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Http } from 'services/http'
import { Socket } from 'services/socket'
import { ButtonIcon } from 'system-ui/button'
import { Radio } from 'system-ui/radio'
import { Transition } from 'system-ui/transition'


const generateGameCode = () => {
  const values = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const getRandomIndex = () => Math.floor(Math.random() * values.length)

  return Array.from({ length: 4 }).map(() => {
    const index = getRandomIndex()
    return values[index]
  }).join('')
}

const InitDialog = ({ onConfirm }) => {
  const nameRef = useRef()
  const codeRef = useRef()
  const [players, setPlayers]  = useState('2')
  const [points, setPoints]  = useState('50')
  const [showSettings, setSettingsVisibility]  = useState(false)

  useEffect(() => {
    nameRef.current.focus()
  }, [])

  const toggleSettings = () => {
    setSettingsVisibility(value => !value)
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const name = formData.get('name')
    const gameCode = formData.get('game-code')
    const players = formData.get('players')
    const points = formData.get('points')

    await createUser({ name })
    await joinOrCreateGame({ gameCode, players, points })
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

  const joinOrCreateGame = async ({ gameCode, players, points }) => {
    const response = await Http.get(`/game/${gameCode}/`)
    if (response.status === 404) {
      return createGame({ gameCode, players, points })
    }
    return joinGame({ gameCode })
  }

  const createGame = ({ gameCode, players, points }) => {
    const options = {
      body: JSON.stringify({ code: gameCode, players, points }),
    }
    return Http.post('/game/create/', options).then(response => response.json())
  }

  const joinGame = ({ gameCode }) => {
    const options = {
      body: JSON.stringify({ code: gameCode }),
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
              <ButtonIcon
                className="code-button"
                aria-label="Generate game code"
                icon="ZAP"
                type="button"
                onClick={generateCode}
              />
            </div>
            <div className="initialize-dialog__config">
              <div className="initialize-dialog__config-header">
                <span>
                  Configure a new game
                </span>
                <ButtonIcon
                  aria-label="Open game settings"
                  variant="ghost"
                  icon="SETTINGS"
                  type="button"
                  onClick={toggleSettings}
                />
              </div>
              <Transition show={showSettings} duration={500}>
                <div className="initialize-dialog__config-content">
                  <div className="initialize-dialog__config-item">
                    <span>Players</span>
                    <div className="initialize-dialog__config-item-selector">
                      <Radio label="2" name="players" value="2" selected={players} onChange={setPlayers}/>
                      <Radio label="3" name="players" value="3" selected={players} onChange={setPlayers}/>
                      <Radio label="4" name="players" value="4" selected={players} onChange={setPlayers}/>
                    </div>
                  </div>
                  <div className="initialize-dialog__config-item">
                    <span>Score</span>
                    <div className="initialize-dialog__config-item-selector">
                      <Radio label="50" name="points" value="50" selected={points} onChange={setPoints}/>
                      <Radio label="100" name="points" value="100" selected={points} onChange={setPoints}/>
                      <Radio label="150" name="points" value="150" selected={points} onChange={setPoints}/>
                    </div>
                  </div>
                </div>
              </Transition>
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
