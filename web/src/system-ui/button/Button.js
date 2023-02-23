import { Icon } from 'system-ui/icon'

import './Button.css'

const ButtonIcon = ({ variant = 'primary', icon, className, ...props }) => {
  return (
    <button
      className={`ui-button ui-button-icon ui-button-icon--${variant} ${className}`}
      {...props}
    >
      <Icon icon={icon} size={18} />
    </button>
  )
}

export { ButtonIcon }
