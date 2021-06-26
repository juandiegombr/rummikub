import { Batch, BatchInt } from '../batch/batch'

export interface PositionInt {
  x: number,
  y: number,
}

export interface TileInt {
  color: string,
  value: number,
  position?: PositionInt
}

export interface GridInt extends Array<Array<TileInt | null>> { }


function getGroups(grid: GridInt): TileInt[][] {
  const row = grid[0]
  const groups = row.reduce((acc: Array<Array<TileInt>>, tile: TileInt | null) => {
    if (!tile) {
      acc.push([])
      return acc
    }

    if (acc.length === 0) {
      acc.push([])
    }

    const lastBatch: TileInt[] = acc[acc.length - 1]
    lastBatch.push(tile)
    return acc
  }, [])
  return groups
}

function validate(grid: GridInt): BatchInt[] {
  const groups = getGroups(grid)

  return groups.map((group) => Batch.create(group))
}

export const Grid = { getGroups, validate }
