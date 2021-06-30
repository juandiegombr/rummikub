import { useRef, useState, useEffect } from "react";

import { TileSpot } from "./tile-spot";
import { Tile } from "./tile";

import "./App.css";

export default function App() {
  const positions = useRef();
  const [spotRelations, setSpotRelations] = useState({});
  const [spotHovered, setSpotHovered] = useState();
  const [moving, setMoving] = useState(false);

  useEffect(() => {
    getAllSpotsPositions();
  }, []);

  const hoverSpot = (position) => {
    const spotIndex = getSpotIndex(position);
    setSpotHovered(spotIndex);
  };

  const onDropTile = (position, id) => {
    const spot = getSpot(position);
    setSpotRelations((value) => ({ ...value, [id]: spot }));
    setMoving(false);
  };

  const getSpot = (position) => {
    const spot = positions.current.find((spot) => {
      if (
        position.x >= spot.startX &&
        position.x <= spot.endX &&
        position.y >= spot.startY &&
        position.y <= spot.endY
      ) {
        return spot;
      }
      return undefined;
    });
    return spot;
  };

  const getSpotIndex = (position) => {
    const spot = positions.current.findIndex((spot) => {
      if (
        position.x >= spot.startX &&
        position.x <= spot.endX &&
        position.y >= spot.startY &&
        position.y <= spot.endY
      ) {
        return spot;
      }
      return undefined;
    });
    return spot;
  };

  const getSpotPositions = (node) => {
    const position = {
      x: node.id.split("-")[0],
      y: node.id.split("-")[1]
    };
    const { left, top, height, width } = node.getBoundingClientRect();
    return {
      startX: left,
      endX: left + width,
      startY: top,
      endY: top + height,
      position
    };
  };

  const getAllSpotsPositions = () => {
    const zone = document.getElementById("drag-zone");
    const spotPositions = [];
    zone.childNodes.forEach((node) => {
      const position = getSpotPositions(node);
      spotPositions.push(position);
    });
    positions.current = spotPositions;
  };

  const onDragTile = () => {
    setMoving(true);
  };

  const onMoveTile = (tileCenterPosition) => {
    hoverSpot(tileCenterPosition);
  };

  const generateMatrix = () => {
    const columns = 10;
    const rows = 2;
    const emptyMatrix = Array.from({ length: rows }).map((row) =>
      Array.from({ length: columns })
    );
    Object.entries(spotRelations).forEach(([key, value]) => {
      const row = value.position.y;
      const column = value.position.x;
      const tile = {
        value: Number(key.split("-")[1]),
        color: key.split("-")[2],
        position: {
          x: column,
          y: row
        }
      };
      emptyMatrix[row][column] = tile;
    });
    console.log(spotRelations);
    console.log(emptyMatrix);
  };

  return (
    <div className="app">
      <button onClick={generateMatrix}>Hello</button>
      <div className="drag-zone" id="drag-zone">
        <TileSpot
          hover={moving && spotHovered === 0}
          position={{ x: 0, y: 0 }}
        />
        <TileSpot
          hover={moving && spotHovered === 1}
          position={{ x: 1, y: 0 }}
        />
        <TileSpot
          hover={moving && spotHovered === 2}
          position={{ x: 2, y: 0 }}
        />
        <TileSpot
          hover={moving && spotHovered === 3}
          position={{ x: 3, y: 0 }}
        />
        <TileSpot
          hover={moving && spotHovered === 4}
          position={{ x: 4, y: 0 }}
        />
        <TileSpot
          hover={moving && spotHovered === 5}
          position={{ x: 5, y: 0 }}
        />
        <TileSpot
          hover={moving && spotHovered === 6}
          position={{ x: 6, y: 0 }}
        />
        <TileSpot
          hover={moving && spotHovered === 7}
          position={{ x: 7, y: 0 }}
        />
        <TileSpot
          hover={moving && spotHovered === 8}
          position={{ x: 8, y: 0 }}
        />
        <TileSpot
          hover={moving && spotHovered === 9}
          position={{ x: 9, y: 0 }}
        />
        <TileSpot
          hover={moving && spotHovered === 10}
          position={{ x: 0, y: 1 }}
        />
        <TileSpot
          hover={moving && spotHovered === 11}
          position={{ x: 1, y: 1 }}
        />
        <TileSpot
          hover={moving && spotHovered === 12}
          position={{ x: 2, y: 1 }}
        />
        <TileSpot
          hover={moving && spotHovered === 13}
          position={{ x: 3, y: 1 }}
        />
        <TileSpot
          hover={moving && spotHovered === 14}
          position={{ x: 4, y: 1 }}
        />
        <TileSpot
          hover={moving && spotHovered === 15}
          position={{ x: 5, y: 1 }}
        />
        <TileSpot
          hover={moving && spotHovered === 16}
          position={{ x: 6, y: 1 }}
        />
        <TileSpot
          hover={moving && spotHovered === 17}
          position={{ x: 7, y: 1 }}
        />
        <TileSpot
          hover={moving && spotHovered === 18}
          position={{ x: 8, y: 1 }}
        />
        <TileSpot
          hover={moving && spotHovered === 19}
          position={{ x: 9, y: 1 }}
        />
      </div>
      <div className="player-zone">
        <Tile
          value={8}
          color="red"
          getSpot={(id) => spotRelations[id]}
          onDrag={onDragTile}
          onMove={onMoveTile}
          onDrop={onDropTile}
        />
        <Tile
          value={9}
          color="red"
          getSpot={(id) => spotRelations[id]}
          onDrag={onDragTile}
          onMove={onMoveTile}
          onDrop={onDropTile}
        />
        <Tile
          value={10}
          color="red"
          getSpot={(id) => spotRelations[id]}
          onDrag={onDragTile}
          onMove={onMoveTile}
          onDrop={onDropTile}
        />
      </div>
    </div>
  );
}
