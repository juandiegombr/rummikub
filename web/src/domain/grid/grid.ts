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

function getGroupsByRow(row: TileInt[]): TileInt[][] {
  const groups = row.reduce((acc: Array<Array<TileInt>>, tile: TileInt | null) => {
    const lastBatch = acc[acc.length - 1]

    if (!tile && lastBatch.length > 0) {
      acc.push([])
      return acc
    }

    if (!tile) {
      return acc
    }

    lastBatch.push(tile)
    return acc
  }, [[]])
  return groups.filter(group => group.length > 0)
}

function getGroups(grid: GridInt): TileInt[][] {
  const groups = grid.map(getGroupsByRow)
  return groups.reduce((acc, group) => acc.concat(group), [])
}

function validate(grid: GridInt): BatchInt[] {
  const groups = getGroups(grid)

  return groups.map((group:any) => Batch.create(group))
}

export const Grid = { getGroups, validate }
