const TileBack = ({ id, onClick, disabled }) => {
  return (
    <button
      id={id}
      aria-label="Get tile"
      className="tile tile__back"
      onClick={onClick}
      disabled={disabled}
    >
      <div className="tile__brand">
        <div className="tile__brand-letter">Rummikub</div>
      </div>
    </button>
  )
}

export { TileBack }
