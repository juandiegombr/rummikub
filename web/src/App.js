import { useRef, useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";

import { TileSpot } from "./tile-spot";
import { Tile } from "./tile";

import { TileService } from "./domain/tile/tile"

import "./App.css";
import { Grid } from "./domain/grid";


const tiles = TileService.generateTiles()
const shuffledTiles = TileService.shuffle(tiles)
const playingTiles = shuffledTiles.slice(0,14)
const spots = Array.from({ length: 2}).map((_, row) => {
  return Array.from({length: 10}).map((_, column) => {
    return { x: column, y: row }
  })
}).reduce((acc, row) => [...acc, ...row], [])

const socket = io(process.env.REACT_APP_WEBSOCKET_HOST, {transports: ['websocket']});

socket.on("JOINED", () => {
  alert('User joined')
});

socket.on("LEAVED", () => {
  alert('User leaved')
});


export default function App() {
  const positions = useRef();
  const [spotRelations, setSpotRelations] = useState({});
  const [spotHovered, setSpotHovered] = useState();
  const [moving, setMoving] = useState(false);
  const [batches, setBatches] = useState([]);

  const getAllSpotsPositions = useCallback(() => {
    const zone = document.getElementById("drag-zone");
    const spotPositions = [];
    zone.childNodes.forEach((node) => {
      const position = getSpotPositions(node);
      spotPositions.push(position);
    });
    positions.current = spotPositions;
  }, [])

  useEffect(() => {
    getAllSpotsPositions();
  }, [getAllSpotsPositions]);

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

  const onDragTile = () => {
    setMoving(true);
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
        value: Number(key.split("_")[2]),
        color: key.split("_")[1],
        position: {
          x: Number(column),
          y: Number(row)
        }
      };
      emptyMatrix[row][column] = tile;
    });
    setBatches(Grid.validate(emptyMatrix))
  };

  const isTileSpotInBatch = ({ x, y }) => {
    // Move to grid domain
    const invalidBatches = batches.filter((batch) => !batch.isValid)
    const batchPositions = invalidBatches.map((batch) => batch.position)
    const positions = batchPositions.reduce((acc, position) => {
      if (position.start.x === position.end.x) {
        return [...acc, position.start]
      }
      const length = position.end.x - position.start.x + 1
      const positions = Array.from({ length }).map((_, index) => {
        return {
          x: position.start.x + index,
          y: position.start.y
        }
      })
      return acc = [...acc, ...positions]
    }, [])
    return positions.find((position) => Number(position.x) === x && Number(position.y) === y)
  }

  const serverRequest = () => {
    fetch('/api/users').then(response => response.json()).then(console.log)
  }

  return (
    <div className="app">
      <button onClick={generateMatrix}>Hello</button>
      <button onClick={serverRequest}>Server</button>
      <div className="drag-zone" id="drag-zone">
        { spots.map((spot, index) => {
          return (
            <TileSpot
              position={spot}
              inBatch={isTileSpotInBatch(spot)}
              hover={moving && spotHovered === index}
            />
          )
        })}
      </div>
      <div className="player-zone">
        {playingTiles.map((tile, key) => {
          return (
            <Tile
              key={key + '-' + tile.value}
              id={tile.id}
              value={tile.value}
              color={tile.color}
              spot={spotRelations[tile.id]}
              onDrag={onDragTile}
              onMove={hoverSpot}
              onDrop={onDropTile}
            />
          )})
        }
      </div>
    </div>
  );
}
