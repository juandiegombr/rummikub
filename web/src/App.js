import { useState } from "react"

import { Tile } from "components/tile"
import { Initialize } from "components/initialize"
import { Grid } from "components/grid"
import { PlayersContainer } from "components/player"
import { Menu } from "components/menu"
import { useStorage } from "services/storage"

import "./App.css"

export default function App() {
  const [players, setPlayers] = useState([])
  const [rounds, setRounds] = useState([])
  const [turn, setTurn] = useState(false)
  const [tiles, setTiles] = useState([])
  const [grid, setGrid] = useState([])
  const [selectedTile, setSelectedTile] = useState(null)
  const Storage = useStorage()

  const userId = Storage.get('userId')
  const player = players.find((player) => player.id === userId)

  return (
    <>
      <div className="app">
        <Initialize
          setPlayers={setPlayers}
          setTurn={setTurn}
          setTiles={setTiles}
          setGrid={setGrid}
          setSelectedTile={setSelectedTile}
          rounds={rounds}
          setRounds={setRounds}
        />
        <PlayersContainer players={players}/>
        <Grid
          player={player}
          turn={turn}
          grid={grid}
          setGrid={setGrid}
          tiles={tiles}
          setTiles={setTiles}
          selectedTile={selectedTile}
          setSelectedTile={setSelectedTile}
        />
        {tiles.map((tile) => {
          return (
            <Tile
              key={tile.id}
              area="player"
              tile={tile}
              spot={{ x: tile.spotX, y: tile.spotY }}
              selected={selectedTile?.id === tile.id}
              onDrag={() => null}
              onMove={() => null}
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
      <Menu/>
    </>
  )
}
