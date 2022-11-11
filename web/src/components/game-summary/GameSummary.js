import { createPortal } from 'react-dom'

import './GameSummary.css'

const GameSummary = ({ rounds, onConfirm }) => {
  return (
    createPortal(
      <div className="initialize-dialog__overlay">
        <div role="dialog" aria-labelledby="initialize-title" className="initialize-dialog">
          <h2 id="initialize-title" className="initialize-dialog__title">🎉 Round finished!</h2>
          <table className="game-summary__table">
            <tr>
              <th>Jugador</th>
              <th>1</th>
              <th>Total</th>
            </tr>
            <tbody>
              {rounds.map((userRounds) => {
                const { userName, scores, total } = userRounds
                return <tr className="game-summary__row">
                  <th className="game-summary__row-name">{userName}</th>
                  {scores.map((score) => {
                    return <td>{score}</td>
                  })}
                  <td>{total}</td>
                </tr>
              })}
            </tbody>
          </table>
          <button className="ui-button" onClick={onConfirm}>Continue</button>
        </div>
      </div>,
      document.getElementById('dialog'),
    )
  )
}

export { GameSummary }
