import React from 'react'

import './Buttons.css'

const Buttons = () => {
  return (
    <div className='buttons-container'>
      <button className='ui-button--secondary'>Undo</button>
      <button className='ui-button--secondary'>Play</button>
      <button className='ui-button--secondary'>Pass</button>
    </div>
  )
}

export { Buttons }
