import './TileSpot.css'

function TileSpot({ position, hover, inBatch, onClick }) {
  return (
    <button
      id={`${position.x}-${position.y}`}
      aria-label={`Spot ${position.x} ${position.y}`}
      className={`tile-spot ${hover ? "tile-spot--hover" : ""} ${inBatch ? "tile-spot--batch" : ""}`}
      onClick={() => onClick(position)}
    >
      <div className="tile-spot__mark" />
    </button>
  )
}

export { TileSpot }
