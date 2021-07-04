import { useRef, useState, useEffect, useCallback } from "react";

import { TileSpot } from "./tile-spot";
import { Tile } from "./tile";

import { TileService } from "./domain/tile/tile"

import "./App.css";
import { Grid } from "./domain/grid";


const tiles = TileService.generateTiles()
const shuffledTiles = TileService.shuffle(tiles)
const playingTiles = shuffledTiles.slice(0,14)

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

  return (
    <div className="app">
      <button onClick={generateMatrix}>Hello</button>
      <div className="drag-zone" id="drag-zone">
        <TileSpot
          position={{ x: 0, y: 0 }}
          inBatch={isTileSpotInBatch({ x: 0, y: 0 })}
          hover={moving && spotHovered === 0}
        />
        <TileSpot
          position={{ x: 1, y: 0 }}
          inBatch={isTileSpotInBatch({ x: 1, y: 0 })}
          hover={moving && spotHovered === 1}
        />
        <TileSpot
          position={{ x: 2, y: 0 }}
          inBatch={isTileSpotInBatch({ x: 2, y: 0 })}
          hover={moving && spotHovered === 2}
        />
        <TileSpot
          position={{ x: 3, y: 0 }}
          inBatch={isTileSpotInBatch({ x: 3, y: 0 })}
          hover={moving && spotHovered === 3}
        />
        <TileSpot
          position={{ x: 4, y: 0 }}
          inBatch={isTileSpotInBatch({ x: 4, y: 0 })}
          hover={moving && spotHovered === 4}
        />
        <TileSpot
          position={{ x: 5, y: 0 }}
          inBatch={isTileSpotInBatch({ x: 5, y: 0 })}
          hover={moving && spotHovered === 5}
        />
        <TileSpot
          position={{ x: 6, y: 0 }}
          inBatch={isTileSpotInBatch({ x: 6, y: 0 })}
          hover={moving && spotHovered === 6}
        />
        <TileSpot
          position={{ x: 7, y: 0 }}
          inBatch={isTileSpotInBatch({ x: 7, y: 0 })}
          hover={moving && spotHovered === 7}
        />
        <TileSpot
          position={{ x: 8, y: 0 }}
          inBatch={isTileSpotInBatch({ x: 8, y: 0 })}
          hover={moving && spotHovered === 8}
        />
        <TileSpot
          position={{ x: 9, y: 0 }}
          inBatch={isTileSpotInBatch({ x: 9, y: 0 })}
          hover={moving && spotHovered === 9}
        />
        <TileSpot
          position={{ x: 0, y: 1 }}
          inBatch={isTileSpotInBatch({ x: 0, y: 1 })}
          hover={moving && spotHovered === 10}
        />
        <TileSpot
          position={{ x: 1, y: 1 }}
          inBatch={isTileSpotInBatch({ x: 1, y: 1 })}
          hover={moving && spotHovered === 11}
        />
        <TileSpot
          position={{ x: 2, y: 1 }}
          inBatch={isTileSpotInBatch({ x: 2, y: 1 })}
          hover={moving && spotHovered === 12}
        />
        <TileSpot
          position={{ x: 3, y: 1 }}
          inBatch={isTileSpotInBatch({ x: 3, y: 1 })}
          hover={moving && spotHovered === 13}
        />
        <TileSpot
          position={{ x: 4, y: 1 }}
          inBatch={isTileSpotInBatch({ x: 4, y: 1 })}
          hover={moving && spotHovered === 14}
        />
        <TileSpot
          position={{ x: 5, y: 1 }}
          inBatch={isTileSpotInBatch({ x: 5, y: 1 })}
          hover={moving && spotHovered === 15}
        />
        <TileSpot
          position={{ x: 6, y: 1 }}
          inBatch={isTileSpotInBatch({ x: 6, y: 1 })}
          hover={moving && spotHovered === 16}
        />
        <TileSpot
          position={{ x: 7, y: 1 }}
          inBatch={isTileSpotInBatch({ x: 7, y: 1 })}
          hover={moving && spotHovered === 17}
        />
        <TileSpot
          position={{ x: 8, y: 1 }}
          inBatch={isTileSpotInBatch({ x: 8, y: 1 })}
          hover={moving && spotHovered === 18}
        />
        <TileSpot
          position={{ x: 9, y: 1 }}
          inBatch={isTileSpotInBatch({ x: 9, y: 1 })}
          hover={moving && spotHovered === 19}
        />
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
        {/* <Tile
          value={12}
          color="red"
          onDrag={onDragTile}
          onMove={hoverSpot}
          onDrop={onDropTile}
        /> */}
        {/* <Tile
          value={13}
          color="blue"
          onDrag={onDragTile}
          onMove={hoverSpot}
          onDrop={onDropTile}
        />
        <Tile
          value={8}
          color="blue"
          onDrag={onDragTile}
          onMove={hoverSpot}
          onDrop={onDropTile}
        /> */}
      </div>
    </div>
  );
}
