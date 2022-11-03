import { useState, useEffect } from "react"

import { Tile } from "components/tile"
import { Initialize } from "components/initialize"
import { Grid } from "components/grid"
import { Buttons } from "components/buttons"

import { Socket } from 'services/socket'

import "./App.css"

export default function App() {
  const [users, setUsers] = useState([])
  const [turn, setTurn] = useState(false)
  const [playingTiles, setTiles] = useState([])
  const [grid, setGrid] = useState([])
  const [selectedTile, setSelectedTile] = useState(null)

  useEffect(() => {
    Socket.init()
  }, [])

  const dropTile = ({ tile }) => {
    Socket.emit('game:move', tile)
  }

  const moveFromGridToGrid = (spot) => {
    const movedTile = {
      ...selectedTile,
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
      userId: null,
      spotX: spot.x,
      spotY: spot.y,
    }
    const updatedTiles = playingTiles.filter((tile) => tile.id !== movedTile.id)
    setTiles(updatedTiles)
    const updatedGrid = [...grid, movedTile]
    setGrid(updatedGrid)
    setSelectedTile(null)
  }

  const moveFromPlayerToPlayer = (spot) => {
    const movedTile = {
      ...selectedTile,
      spotX: spot.x,
      spotY: spot.y,
    }
    const updatedTiles = playingTiles.map((tile) => {
      if (tile.id === movedTile.id) {
        return movedTile
      }
      return tile
    })
    setTiles(updatedTiles)
    setSelectedTile(null)
  }

  const moveFromGridToPlayer = (spot) => {
    const movedTile = {
      ...selectedTile,
      userId: localStorage.userId,
      spotX: spot.x,
      spotY: spot.y,
    }
    const updatedTiles = [...playingTiles, movedTile]
    setTiles(updatedTiles)
    const updatedGrid = grid.filter((tile) => tile.id !== movedTile.id)
    setGrid(updatedGrid)
    setSelectedTile(null)
  }

  const performTileMove = (spot) => {
    if (!selectedTile) return

    const isFromPlayer = !!selectedTile.userId
    const isFromGrid = !isFromPlayer
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

  const handleMove = (grid) => {
    setGrid(grid)
  }

  return (
    <div className="app">
      <Initialize
        setUsers={setUsers}
        setTiles={setTiles}
        setSelectedTile={setSelectedTile}
        setTurn={setTurn}
        onMove={handleMove}
      />
      <Grid onSelectSpot={performTileMove}/>
      {turn && <Buttons grid={grid}/>}
      {playingTiles.map((tile) => {
        return (
          <Tile
            key={tile.id}
            area="player"
            tile={tile}
            spot={{ x: tile.spotX, y: tile.spotY }}
            selected={selectedTile?.id === tile.id}
            onDrag={() => null}
            onMove={() => null}
            onDrop={dropTile}
            onClick={setSelectedTile}
          />
        )})
      }
      {grid.map((tile) => {
        return (
          <Tile
            key={tile.id}
            area="grid"
            tile={tile}
            spot={{ x: tile.spotX, y: tile.spotY }}
            selected={selectedTile?.id === tile.id}
            onDrag={() => null}
            onMove={() => null}
            onClick={setSelectedTile}
            disabled={!turn}
          />
        )})
      }
    </div>
  )
}
