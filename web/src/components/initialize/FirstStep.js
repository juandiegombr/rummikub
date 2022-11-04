import { createPortal } from 'react-dom'
import { Socket } from 'services/socket'
import { Http } from 'services/http'

const FirstStep = ({ onCreate, onJoin }) => {

  const createGame = async () => {
    const { gameCode } = await Http.get('/game/create').then(response => response.json())
    localStorage.setItem('gameCode', gameCode)
    Socket.reconnect()
    Socket.emit('game:join', { gameCode })
    onCreate()
  }

  return (
    createPortal(
      <div className="initialize-dialog__overlay">
        <div role="dialog" aria-labelledby="initialize-title" className="initialize-dialog">
          <h2 id="initialize-title" className="initialize-dialog__title">Hello {localStorage.userName}</h2>
          <p className="initialize-dialog__description">What do you want to do?</p>
          <div className="initialize-dialog__actions">
            <button className="ui-button" onClick={createGame}>Create game</button>
            <button className="ui-button" onClick={onJoin}>Join game</button>
          </div>
        </div>
      </div>,
      document.getElementById('dialog'),
    )
  )
}

export { FirstStep }
