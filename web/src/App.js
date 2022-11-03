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

  const performTileMove = (spot) => {
    if (!selectedTile) return
    const movedTile = {
      ...selectedTile,
      spotX: spot.x,
      spotY: spot.y,
    }

    const isFromGrid = Number.isInteger(selectedTile.spotX) && Number.isInteger(selectedTile.spotY)
    if (isFromGrid) {
      const newGrid = grid.map((tile) => {
        if (tile.id === selectedTile.id) {
          return movedTile
        }
        return tile
      })
      setGrid(newGrid)
      setSelectedTile(null)
      return
    }

    const newPlayingTiles = playingTiles.filter((tile) => tile.id !== selectedTile.id)
    setTiles(newPlayingTiles)
    const newGrid = [...grid, movedTile]
    setGrid(newGrid)
    setSelectedTile(null)
  }

  const handleMove = (grid) => {
    setGrid(grid)
  }

  return (
    <div className="app">
      <Initialize
        setUsers={setUsers}
        setTiles={setTiles}
        setTurn={setTurn}
        onMove={handleMove}
      />
      {users.map((user) => {
        return (
          <div key={user.id}>{user.name}</div>
        )
      })}
      <Grid onSelectSpot={performTileMove}/>
      {turn && <Buttons grid={grid}/>}
      <div className="player-zone">
        {playingTiles.map((tile, key) => {
          return (
            <Tile
              key={tile.id}
              tile={tile}
              spot={grid[tile.id]}
              selected={selectedTile?.id === tile.id}
              onDrag={() => null}
              onMove={() => null}
              onDrop={dropTile}
              onClick={setSelectedTile}
              disabled={!turn}
            />
          )})
        }
      </div>
      <div className="played-zone">
        {grid.map((tile, key) => {
          return (
            <Tile
              key={tile.id}
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
    </div>
  )
}
