import { useStorage } from 'services/storage'

import './Player.css'

import { Player } from './Player'

const getOrderedPlayers = (players, userId) => {
  const myPosition = players.findIndex((player) => player.id === userId)
  const previousPlayers = players.slice(0, myPosition)
  const nextPlayers = players.slice(myPosition + 1)
  return [...nextPlayers, ...previousPlayers]
}

const PlayersContainer = ({ players }) => {
  const Storage = useStorage()

  const userId = Storage.get('userId')

  if (!userId) {
    return null
  }

  return (
    <div className="players-container">
      {getOrderedPlayers(players, userId).map((player) => {
        return <Player key={player.id} player={player} />
      })}
    </div>
  )
}

export { PlayersContainer }
