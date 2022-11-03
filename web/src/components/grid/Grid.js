import { TileSpot } from 'components/tile-spot'
import { Socket } from 'services/socket'

import './Grid.css'

const GRID_SPOTS = Array.from({ length: 4 }).map((_, row) => {
  return Array.from({ length: 14 }).map((_, column) => {
    return { area: 'grid', x: column, y: row }
  })
}).reduce((acc, row) => [...acc, ...row], [])

const PLAYER_SPOTS = Array.from({ length: 2 }).map((_, row) => {
  return Array.from({ length: 10 }).map((_, column) => {
    return { area: 'player', x: column, y: row }
  })
}).reduce((acc, row) => [...acc, ...row], [])

const Grid = ({ onSelectSpot }) => {
  const pass = () => {
    const spot = { x: 10, y: 1 }
    Socket.emit('game:pass', spot)
  }

  return (
    <>
      <div id="grid-zone" className="grid-zone">
        { GRID_SPOTS.map((spot, index) => {
          return (
            <TileSpot
              key={'spot-' + index}
              area="grid"
              position={spot}
              onClick={() => onSelectSpot(spot)}
            />
          )
        })}
      </div>
      <div id="player-zone" className="player-zone">
        { PLAYER_SPOTS.map((spot, index) => {
          return (
            <TileSpot
              key={'spot-' + index}
              area="player"
              position={spot}
              onClick={() => onSelectSpot(spot)}
            />
          )
        })}
        <button id="player-10-1" className="tile-spot button-pass" onClick={pass}>
          Get tile
        </button>
      </div>
    </>
  )
}

export { Grid }
