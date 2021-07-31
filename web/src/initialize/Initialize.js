import React from 'react'
import { createPortal } from 'react-dom'

import './Initialize.css'

const Initialize = () => {
  return (
    createPortal(
      <div className="initialize-dialog__overlay">
      <div role="dialog" aria-labelledby="initialize-title" className="initialize-dialog">
        <h2 id="initialize-title" className="initialize-dialog__title">Welcome! 👋</h2>
        <p className="initialize-dialog__description">What do you want to do?</p>
        <div className="initialize-dialog__actions">
          <button className="ui-button">Create game</button>
          <button className="ui-button">Join game</button>
        </div>
      </div>
      </div>,
      document.getElementById('dialog')
    )
  )
}

export { Initialize }
