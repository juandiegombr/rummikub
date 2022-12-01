import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import './Dialog.css'

const Dialog = ({ show, children }) => {
  const [isVisible, setVisibility] = useState(false)
  const [isTransitionActive, setTransitionStatus] = useState(false)

  useEffect(() => {
    if (show) {
      setTransitionStatus(true)
      setVisibility(true)
    }

    if (!show && isVisible) {
      setTimeout(() => {
        setVisibility(false)
        setTransitionStatus(false)
      }, 1000)
    }
  }, [show])

  const dialogClassName = () => {
    let className = 'ui-dialog ui-dialog--start'
    if (isTransitionActive) {
      className = className + ' ui-dialog--show'
    }
    if (show) {
      className = className + ' ui-dialog--end'
    }
    if (show && isTransitionActive) {
      className = className + ' ui-dialog--in ui-dialog--end'
    }
    if (!show && isTransitionActive) {
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
