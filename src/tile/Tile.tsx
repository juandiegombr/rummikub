import './Tile.css'

function Tile(props: { value: number, color: string }) {
  const { value, color } = props

  return (
    <div className={`tile tile--${color}`}>
      <div className="tile__number">
        {value}
      </div>
      <div className="tile__brand">
        <div className="tile__brand-letter">R</div>
        <div className="tile__brand-letter">u</div>
        <div className="tile__brand-letter">m</div>
        <div className="tile__brand-letter">m</div>
        <div className="tile__brand-letter">i</div>
        <div className="tile__brand-letter">k</div>
        <div className="tile__brand-letter">u</div>
        <div className="tile__brand-letter">b</div>
      </div>
    </div>
  )
}

export { Tile }
