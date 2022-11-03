import { Socket } from 'services/socket'

import './Buttons.css'

const Buttons = ({ grid }) => {
  const play = () => {
    Socket.emit('game:play', grid)
  }

  return (
    <div className='buttons-container'>
      <button className='ui-button--secondary'>Undo</button>
      <button className='ui-button--secondary' onClick={play}>Play</button>
    </div>
  )
}

export { Buttons }
