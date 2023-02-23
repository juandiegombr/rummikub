const TileButton = ({ disabled, onClick }) => {
  return (
    <button
      aria-label="Play"
      className="tile tile__button"
      onClick={onClick}
      disabled={disabled}
    >
      PLAY
    </button>
  )
}

export { TileButton }
