const Player = ({ player, self }) => {
  const className = () => {
    let className = 'player'
    if (player.turn) {
      className = className + ' player--turn'
    }
    if (self) {
      className = className + ' player--self'
    }
    return className
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
