import { useEffect, useRef, useState } from 'react'

import { useStorage } from 'services/storage'
import { ButtonIcon } from 'system-ui/button'

import './Menu.css'

const Menu = () => {
  const [showMenu, setMenuVisibility] = useState(false)
  const ref = useRef()
  const Storage = useStorage()

  const handleClick = (event) => {
    /* eslint-disable */ console.log('event.target', event.target)
    /* eslint-disable */ console.log('ref.current', ref.current)
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
