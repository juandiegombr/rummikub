import { TileSpot } from "components/tile-spot"

const spots = Array.from({ length: 2 }).map((_, row) => {
  return Array.from({ length: 10 }).map((_, column) => {
    return { x: column, y: row }
  })
}).reduce((acc, row) => [...acc, ...row], [])

const Grid = () => {
  return (
    <div className="drag-zone" id="drag-zone">
      { spots.map((spot, index) => {
        return (
          <TileSpot
            key={'spot-' + index}
            position={spot}
          />
        )
      })}
    </div>
  )
}

export { Grid }
