import { useState, useEffect } from "react"

import { Tile } from "components/tile"
import { Initialize } from "components/initialize"
import { Grid } from "components/grid"

import { Socket } from 'services/socket'

import "./App.css"


export default function App() {
  const [game, setGame] = useState()
  const [playingTiles, setTiles] = useState([])

  useEffect(() => {
    Socket.init()
  }, [])

  const dropTile = ({ tile }) => {
    Socket.emit('game:move', tile)
  }

  return (
    <div className="app">
      <Initialize game={game} setGame={setGame} setTiles={setTiles} />
      <Grid/>
      <div className="player-zone">
        {playingTiles.map((tile, key) => {
          return (
            <Tile
              key={key + '-' + tile.value}
              tile={tile}
              spot={null}
              onDrag={() => null}
              onMove={() => null}
              onDrop={dropTile}
            />
          )})
        }
      </div>
    </div>
  )
}
