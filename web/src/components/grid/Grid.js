import { Player } from 'components/player'
import { TileSpot } from 'components/tile-spot'
import { TileBack } from 'components/tile/TileBack'
import { Socket } from 'services/socket'
import { GameButton } from 'system-ui/game-button'

import './Grid.css'

const GRID_SPOTS = Array.from({ length: 5 })
  .map((_, row) => {
    return Array.from({ length: 20 }).map((_, column) => {
      return { area: 'grid', x: column, y: row }
    })
  })
  .reduce((acc, row) => [...acc, ...row], [])

const PLAYER_SPOTS = Array.from({ length: 3 })
  .map((_, row) => {
    return Array.from({ length: 10 }).map((_, column) => {
      return { area: 'player', x: column, y: row }
    })
  })
  .reduce((acc, row) => [...acc, ...row], [])

const Grid = ({
  player,
  turn,
  grid,
  setGrid,
  tiles,
  setTiles,
  selectedTile,
  setSelectedTile,
}) => {
  const moveFromGridToGrid = (spot) => {
    const movedTile = {
      ...selectedTile,
      area: 'grid',
      spotX: spot.x,
      spotY: spot.y,
    }

    const updatedGrid = grid.map((tile) => {
      if (tile.id === selectedTile.id) {
        return movedTile
      }
      return tile
    })
    setGrid(updatedGrid)
    setSelectedTile(null)
  }

  const moveFromPlayerToGrid = (spot) => {
    const movedTile = {
      ...selectedTile,
      area: 'grid',
      spotX: spot.x,
      spotY: spot.y,
    }
    const updatedTiles = tiles.filter((tile) => tile.id !== movedTile.id)
    setTiles(updatedTiles)
    const updatedGrid = [...grid, movedTile]
    setGrid(updatedGrid)
    setSelectedTile(null)
  }

  const moveFromPlayerToPlayer = (spot) => {
    const movedTile = {
      ...selectedTile,
      area: 'player',
      spotX: spot.x,
      spotY: spot.y,
    }
    const updatedTiles = tiles.map((tile) => {
      if (tile.id === movedTile.id) {
        return movedTile
      }
      return tile
    })
    setTiles(updatedTiles)
    setSelectedTile(null)
    Socket.emit('game:move:self', updatedTiles)
  }

  const moveFromGridToPlayer = (spot) => {
    const movedTile = {
      ...selectedTile,
      area: 'player',
      spotX: spot.x,
      spotY: spot.y,
    }
    const updatedTiles = [...tiles, movedTile]
    setTiles(updatedTiles)
    const updatedGrid = grid.filter((tile) => tile.id !== movedTile.id)
    setGrid(updatedGrid)
    setSelectedTile(null)

    if (selectedTile.userId) {
      Socket.emit('game:move:self', updatedTiles)
    }
  }

  const moveTile = (spot) => {
    if (!selectedTile) return

    const isFromPlayer = selectedTile.area === 'player'
    const isFromGrid = selectedTile.area === 'grid'
    const isToGrid = spot.area === 'grid'
    const isToPlayer = spot.area === 'player'

    if (!turn && (isFromGrid || isToGrid)) return

    if (isFromPlayer && isToPlayer) {
      return moveFromPlayerToPlayer(spot)
    }

    if (isFromPlayer && isToGrid) {
      return moveFromPlayerToGrid(spot)
    }

    if (isFromGrid && isToGrid) {
      return moveFromGridToGrid(spot)
    }

    if (isFromGrid && isToPlayer) {
      return moveFromGridToPlayer(spot)
    }
  }

  const play = () => {
    if (!turn) return
    Socket.emit('game:play', grid)
  }

  const pass = () => {
    if (!turn) return
    const spot = { x: 10, y: 1 }
    Socket.emit('game:pass', spot)
  }

  return (
    <>
      <div id="grid-zone" className="grid-zone">
        {GRID_SPOTS.map((spot, index) => {
          return (
            <TileSpot
              key={'spot-' + index}
              area="grid"
              position={spot}
              onClick={() => moveTile(spot)}
            />
          )
        })}
      </div>
      <div id="player-zone" className="player-zone">
        {PLAYER_SPOTS.map((spot, index) => {
          return (
            <TileSpot
              key={'spot-' + index}
              area="player"
              position={spot}
              onClick={() => moveTile(spot)}
            />
          )
        })}
        <GameButton onClick={play} disabled={!turn}>
          Play
        </GameButton>
        <TileBack id="player-10-1" onClick={pass} disabled={!turn} />
        {player && <Player player={player} self />}
      </div>
    </>
  )
}

export { Grid }
