import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Socket } from 'services/socket'
import { Http } from 'services/http'

const JoinStep = ({ onConfirm }) => {
  const inputRef = useRef()

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  const joinGame = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const gameCode = formData.get('code')

    const response = await Http.get(`/game/join/${gameCode}`)

    if (response.status === 404) {
      return
    }

    localStorage.setItem('gameCode', gameCode)
    Socket.reconnect()
    Socket.emit('game:join', { gameCode })
    onConfirm()
  }

  return (
    createPortal(
      <div className="initialize-dialog__overlay">
        <div role="dialog" aria-labelledby="initialize-title" className="initialize-dialog">
          <h2 id="initialize-title" className="initialize-dialog__title">Join game 🎯</h2>
          <form className="initialize-dialog__form" onSubmit={joinGame}>
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

export { JoinStep }
