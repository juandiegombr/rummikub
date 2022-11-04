import { createPortal } from 'react-dom'

const Error = ({ onRetry, onPass }) => {
  return (
    createPortal(
      <div className="initialize-dialog__overlay">
        <div role="dialog" aria-labelledby="initialize-title" className="initialize-dialog">
          <h2 id="initialize-title" className="initialize-dialog__title">Invalid move ℹ️</h2>
          <p className="initialize-dialog__description">The play is not valid</p>
          <div className="initialize-dialog__actions">
            <button className="ui-button" onClick={onRetry}>Try again</button>
            <button className="ui-button" onClick={onPass}>Pass</button>
          </div>
        </div>
      </div>,
      document.getElementById('dialog'),
    )
  )
}

export { Error }
