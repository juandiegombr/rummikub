import { useStorage } from 'services/storage'
import { ButtonIcon } from 'system-ui/button'
import { Dialog } from 'system-ui/dialog'

const WaitingDialog = ({ show }) => {
  const Storage = useStorage()

  const gameCode = Storage.get('gameCode')

  const copyToClipboard = () => {
    navigator.clipboard.writeText(gameCode)
  }

  return (
    <Dialog show={show} aria-labelledby="waiting-dialog-title">
      <h2 id="waiting-dialog-title" className="initialize-dialog__title">
        ⏳ Waiting for a player
      </h2>
      <p className="initialize-dialog__description">
        Share the game code to start playing
      </p>
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
    </Dialog>
  )
}

export { WaitingDialog }
