import React from 'react'

import { Socket } from 'services/socket'

import './Buttons.css'

const Buttons = ({ grid }) => {
  const play = () => {
    Socket.emit('game:play', grid)
  }

  const pass = () => {
    Socket.emit('game:pass')
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
