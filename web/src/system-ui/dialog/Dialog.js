import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import './Dialog.css'

const Dialog = ({ show, children }) => {
  const [isVisible, setVisibility] = useState(false)

  useEffect(() => {
    if (show) {
      setVisibility(true)
    }

    if (!show && isVisible) {
      setTimeout(() => {
        setVisibility(false)
      }, 500)
    }
  }, [])

  const dialogClassName = () => {
    let className = 'ui-dialog ui-dialog--start'
    if (show) {
      className = className + 'ui-dialog--show ui-dialog--in ui-dialog--end'
    }
    if (!show) {
      className = className + ' ui-dialog--out'
    }
    return className
  }

  return (createPortal(
    <div className={dialogClassName()}>
      <div className='ui-dialog__content'>
        {children}
      </div>
    </div>,
    document.getElementById('dialog'),
  ))
}

export { Dialog }
