import { useState, useEffect } from "react"

import { Tile } from "components/tile"
import { Initialize } from "components/initialize"
import { Grid } from "components/grid"
import { Buttons } from "components/buttons"

import { Socket } from 'services/socket'

import "./App.css"
import { Http } from "services/http"


export default function App() {
  const [playingTiles, setTiles] = useState([])
  const [grid, setGrid] = useState({})
  const [selectedTile, setSelectedTile] = useState(null)

  useEffect(() => {
    Socket.init()
    Http.get('/ramon/').then((res) => res.json()).then(console.log)
  }, [])

  const dropTile = ({ tile }) => {
    /* eslint-disable */ console.log('tile', tile)
    Socket.emit('game:move', tile)
  }

  const performTileMove = (spot) => {
    if (!selectedTile) return
    /* eslint-disable */ console.log('selectedTile', selectedTile)
    const move = {
      tile: selectedTile,
      spot,
    }
    Socket.emit('game:move', move)
    const newPlayingTiles = playingTiles.filter((tile) => tile.id !== selectedTile.id)
    setTiles(newPlayingTiles)
    setSelectedTile(null)
  }

  const handleMove = (grid) => {
    setGrid(grid)
  }

  const gridTiles = Object.values(grid)

  return (
    <div className="app">
      <Initialize setTiles={setTiles} onMove={handleMove}/>
      <Grid onSelectSpot={performTileMove}/>
      <Buttons/>
      <div className="player-zone">
        {playingTiles.map((tile, key) => {
          return (
            <Tile
              key={key + '-' + tile.value}
              tile={tile}
              spot={grid[tile.id]}
              selected={selectedTile?.id === tile.id}
              onDrag={() => null}
              onMove={() => null}
              onDrop={dropTile}
              onClick={setSelectedTile}
            />
          )})
        }
      </div>
      <div className="played-zone">
        {gridTiles.map((tile, key) => {
          return (
            <Tile
              key={key + '-' + tile.value}
              tile={tile}
              spot={{ x: tile.spotX, y: tile.spotY }}
              selected={selectedTile?.id === tile.id}
              onDrag={() => null}
              onMove={() => null}
              onClick={setSelectedTile}
            />
          )})
        }
      </div>
    </div>
  )
}
