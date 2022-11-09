const Player = ({ player }) => {
  const className = () => {
    if (player.turn) {
      return 'player player--turn'
    }
    return 'player'
  }

  return (
    <div className={className()}>
      <div className="player-name">{player.name}</div>
      {/* <div className="player-score">{player.score}</div> */}
      <div className="player-tiles">{player.tiles}</div>
    </div>
  )
}

export { Player }
