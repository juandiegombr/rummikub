import { useEffect, useState } from 'react'

import './Transition.css'

const Transition = ({ show, duration, children }) => {
  const [isVisible, setVisibility] = useState(false)

  useEffect(() => {
    if (show) {
      setVisibility(true)
    }

    if (!show && isVisible) {
      setTimeout(() => {
        setVisibility(false)
      }, duration)
    }
  }, [show])

  const transitionClassName = () => {
    let className = 'ui-transition ui-transition--start'
    if (show) {
      className = className + ' ui-transition--end'
    }
    return className
  }

  return <div className={transitionClassName()}>
    <div className='ui-transition__content'>
      {children}
    </div>
  </div>
}

export { Transition }
