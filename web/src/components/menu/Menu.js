import { useEffect, useRef, useState } from 'react'

import { Socket } from 'services/socket'
import { useStorage } from 'services/storage'
import { GameButton } from 'system-ui/game-button'
import { Icon } from 'system-ui/icon'

import './Menu.css'

const isDebugModeOn = () => {
  const searchParams = new URLSearchParams(window.location.search)
  return process.env.NODE_ENV === 'development' || searchParams.get('debug')
}

const Menu = () => {
  const [showMenu, setMenuVisibility] = useState(false)
  const ref = useRef()
  const Storage = useStorage()

  const handleClick = (event) => {
    const isClickOutside = !ref.current.contains(event.target)
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

  const closeMenu = () => {
    setMenuVisibility(false)
  }

  const exitGame = () => {
    Storage.clear()
    closeMenu()
  }

  const debugGameFinish = () => {
    const rounds = [
      {
        userName: 'John Doe',
        scores: [1, 2, 3],
        total: 6,
      },
      {
        userName: 'Phileas Fogg',
        scores: [-1, -2, -3],
        total: -6,
      },
    ]
    Socket.debug('game:finish', rounds)
    closeMenu()
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
          onClick={() => setMenuVisibility((value) => !value)}
        >
          <Icon icon="MENU" size={18} />
        </GameButton>
        {showMenu && (
          <div className="ui-dropdown__menu">
            {isDebugModeOn() && (
              <button
                className="ui-dropdown__menu-item"
                onClick={debugGameFinish}
              >
                Debug
              </button>
            )}
            <button className="ui-dropdown__menu-item" onClick={exitGame}>
              Salir de la partida
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export { Menu }
