import './GameButton.css'

const GameButton = ({ variant = 'primary', icon, className, children, ...props }) => {
  return (
    <button className={`ui-game-button ${className}`} {...props}>
      { children }
    </button>
  )
}

export { GameButton }
