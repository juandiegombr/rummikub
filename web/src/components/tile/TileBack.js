const TileBack = ({ id, onClick }) => {
  return (
    <button
      id={id}
      aria-label="Get tile"
      className="tile tile__back"
      onClick={onClick}
    >
      <div className="tile__brand">
        <div className="tile__brand-letter">Rummikub</div>
      </div>
    </button>
  )
}

export { TileBack }
