import { useState, useEffect } from "react"

import { Tile } from "components/tile"
import { Initialize } from "components/initialize"
import { Grid } from "components/grid"

import { Socket } from 'services/socket'

import "./App.css"


export default function App() {
  const [playingTiles, setTiles] = useState([])

  useEffect(() => {
    Socket.init()
  }, [])

  return (
    <div className="app">
      <Initialize setTiles={setTiles} />
      <Grid/>
      <div className="player-zone">
        {playingTiles.map((tile, key) => {
          return (
            <Tile
              key={key + '-' + tile.value}
              id={tile.id}
              value={tile.value}
              color={tile.color}
              spot={null}
              onDrag={() => null}
              onMove={() => null}
              onDrop={() => null}
            />
          )})
        }
      </div>
    </div>
  )
}
