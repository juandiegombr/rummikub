import { useState } from 'react'

import { useStorage } from 'services/storage'
import { ButtonIcon } from 'system-ui/button'

import './Menu.css'

const Menu = () => {
  const [showMenu, setMenuVisibility] = useState(false)
  const Storage = useStorage()

  const exitGame = () => {
    Storage.clear()
    setMenuVisibility(false)
  }

  return (
    <div className="menu">
      <div className="menu__dropdown">
        <ButtonIcon
          aria-label="Open game settings"
          className="ui-dropdown__button"
          variant="secondary"
          icon="MENU"
          type="button"
          onClick={() => setMenuVisibility(value => !value)}
        />
        { showMenu && (
          <div className="ui-dropdown__menu">
            <button onClick={exitGame}>
              Salir de la partida
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export { Menu }
