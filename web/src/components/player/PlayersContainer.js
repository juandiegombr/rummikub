import { Player } from './Player'

import './Player.css'

const PlayersContainer = ({ players }) => {
  const userId = localStorage.userId
  return (
    <div className='players-container'>
      {players.filter((user) => user.id !== userId).map((player) => {
        return <Player player={player} />
      })}
    </div>
  )
}

export { PlayersContainer }
