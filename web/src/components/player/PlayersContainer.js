import { Player } from './Player'

import './Player.css'

const getOrderedPlayers = (players) => {
  const userId = localStorage.userId
  const myPosition = players.findIndex((player) => player.id === userId)
  const previousPlayers = players.slice(0, myPosition)
  const nextPlayers = players.slice(myPosition + 1)
  return [...nextPlayers, ...previousPlayers]
}

const PlayersContainer = ({ players }) => {
  return (
    <div className='players-container'>
      {getOrderedPlayers(players).map((player) => {
        return <Player key={player.name} player={player} />
      })}
    </div>
  )
}

export { PlayersContainer }
