import { useEffect, useRef, useState } from 'react'

import { useStorage } from 'services/storage'
import { GameButton } from 'system-ui/game-button'
import { Icon } from 'system-ui/icon'

import './Menu.css'

const Menu = () => {
  const [showMenu, setMenuVisibility] = useState(false)
  const ref = useRef()
  const Storage = useStorage()

  const handleClick = (event) => {
    const isClickOutside = !event.target.contains(ref.current)
    if (isClickOutside && showMenu) {
      setMenuVisibility(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [handleClick])

  const exitGame = () => {
    Storage.clear()
    setMenuVisibility(false)
  }

  return (
    <div className="menu">
      <div className="menu__dropdown" ref={ref}>
        <GameButton
          aria-label="Open game settings"
          className="ui-dropdown__button"
          variant="secondary"
          shape="rounded"
          icon="MENU"
          type="button"
          onClick={() => setMenuVisibility(value => !value)}
        >
          <Icon icon="MENU" size={18}/>
        </GameButton>
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
