import { Player } from './Player'

import './Player.css'

const PlayersContainer = ({ players }) => {
  return (
    <div className='players-container'>
      {players.map((player) => {
        return <Player player={player} />
      })}
    </div>
  )
}

export { PlayersContainer }
