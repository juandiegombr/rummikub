import { createPortal } from 'react-dom'

import { useStorage } from 'services/storage'
import { ButtonIcon } from 'system-ui/button'

const WaitingDialog = () => {
  const Storage = useStorage()

  const gameCode = Storage.get('gameCode')

  const copyToClipboard = () => {
    navigator.clipboard.writeText(gameCode)
  }

  return (
    createPortal(
      <div className="initialize-dialog__overlay">
        <div role="dialog" aria-labelledby="initialize-title" className="initialize-dialog">
          <h2 id="initialize-title" className="initialize-dialog__title">⏳ Waiting for a player</h2>
          <p className="initialize-dialog__description">Share the game code to start playing</p>
          <div className="initialize-dialog__code">
            <span>{gameCode}</span>
            <ButtonIcon
              aria-label="Copy game code to clipboard"
              variant="ghost"
              icon="COPY"
              type="button"
              onClick={copyToClipboard}
            />
          </div>
        </div>
      </div>,
      document.getElementById('dialog'),
    )
  )
}

export { WaitingDialog }
