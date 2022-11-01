import React from 'react'

import { Socket } from 'services/socket'

import './Buttons.css'

const Buttons = () => {
  const play = () => {
    Socket.emit('game:turn:off')
  }

  return (
    <div className='buttons-container'>
      <button className='ui-button--secondary'>Undo</button>
      <button className='ui-button--secondary' onClick={play}>Play</button>
      <button className='ui-button--secondary'>Pass</button>
    </div>
  )
}

export { Buttons }
