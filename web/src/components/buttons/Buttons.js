import React from 'react'

import { Socket } from 'services/socket'

import './Buttons.css'

const Buttons = ({ setTurn }) => {
  const play = () => {
    Socket.emit('game:play')
    setTurn(false)
  }

  const pass = () => {
    Socket.emit('game:pass')
    setTurn(false)
  }

  return (
    <div className='buttons-container'>
      <button className='ui-button--secondary'>Undo</button>
      <button className='ui-button--secondary' onClick={play}>Play</button>
      <button className='ui-button--secondary' onClick={pass}>Pass</button>
    </div>
  )
}

export { Buttons }
