import { Dialog } from 'system-ui/dialog'

import './GameSummary.css'

const GameSummary = ({ show, rounds, onConfirm }) => {
  const totalRounds = rounds.length ? rounds[0].scores : []

  return (
    <Dialog show={show}>
      <h2 id="initialize-title" className="initialize-dialog__title">
        🎉 Round finished!
      </h2>
      <table className="game-summary__table">
        <thead>
          <tr>
            <th>Jugador</th>
            {totalRounds.map((_, index) => {
              return <th>{index + 1}</th>
            })}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {rounds.map((userRounds, userIndex) => {
            const { userName, scores, total } = userRounds
            return (
              <tr key={'row-' + userIndex} className="game-summary__row">
                <th className="game-summary__row-name">{userName}</th>
                {scores.map((score, scoreIndex) => {
                  return <td key={'cell-' + scoreIndex}>{score}</td>
                })}
                <td>{total}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <button className="ui-button" onClick={onConfirm}>
        Continue
      </button>
    </Dialog>
  )
}

export { GameSummary }
