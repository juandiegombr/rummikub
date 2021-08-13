import './TileSpot.css'

function TileSpot({ position, hover, inBatch }) {
  return (
    <div
      id={`${position.x}-${position.y}`}
      className={`tile-spot ${hover ? "tile-spot--hover" : ""} ${inBatch ? "tile-spot--batch" : ""}`}
    >
      <div className="tile-spot__mark" />
    </div>
  )
}

export { TileSpot }
