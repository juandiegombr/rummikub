import { createPortal } from 'react-dom'

const WaitingStep = () => {
  return (
    createPortal(
      <div className="initialize-dialog__overlay">
        <div role="dialog" aria-labelledby="initialize-title" className="initialize-dialog">
          <h2 id="initialize-title" className="initialize-dialog__title">⏳ Waiting for a player</h2>
          <p className="initialize-dialog__description">Share the game code to start playing</p>
          <div className="initialize-dialog__code">{localStorage.gameCode}</div>
        </div>
      </div>,
      document.getElementById('dialog'),
    )
  )
}

export { WaitingStep }