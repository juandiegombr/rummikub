import './TileSpot.css'

function TileSpot({ position, hover, onTileDrop }) {
  const getTile = (id, position) => {
    const [, value, color] = id.split("-");
    return {
      value: Number(value),
      color,
      position
    };
  };

  const onDrop = (event) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("text");
    event.target.parentElement.appendChild(document.getElementById(id));
    const tile = getTile(id, position);
    onTileDrop(tile);
  };
  const onDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div
      id={`${position.x}-${position.y}`}
      className={`tile-spot ${hover ? "tile-spot--hover" : ""}`}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="tile-spot__mark" />
    </div>
  );
}

export { TileSpot };
