import './GameButton.css'

const GameButton = ({
  variant = 'primary',
  shape = 'regular',
  icon,
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={`ui-game-button ui-game-button--${variant} ui-game-button--${shape} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export { GameButton }
