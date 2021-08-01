import { TileInt, PositionInt } from '../grid/grid'

export interface BatchPositionInt {
  start?: PositionInt,
  end?: PositionInt,
}

export interface BatchInt {
  tiles: TileInt[];
  isValid: boolean,
  position: BatchPositionInt,
}

function areOrdered(tiles: TileInt[]): boolean {
  let isValid = true

  tiles.forEach((tile, index) => {
    if (index === 0) return
    if (isValid === false) return

    const prevTile = tiles[index - 1]
    if (tile.value !== prevTile.value + 1) {
      isValid = false
    }
  })

  return isValid
}

function areSameColor(tiles: TileInt[]): boolean {
  const colors = tiles.map((tile) => tile.color)
  const colorsSet = new Set(colors)
  return [...colorsSet].length === 1
}

function areDifferentColor(tiles: TileInt[]): boolean {
  const colors = tiles.map((tile) => tile.color)
  const colorsSet = new Set(colors)
  return [...colorsSet].length === tiles.length
}

function areSameValue(tiles: TileInt[]): boolean {
  const values = tiles.map((tile) => tile.value)
  const valuesSet = new Set(values)
  return [...valuesSet].length === 1
}

function validate(tiles:TileInt[]): boolean {
  if (tiles.length < 3) return false
  if (areSameValue(tiles) && areDifferentColor(tiles)) return true
  if (areOrdered(tiles) && areSameColor(tiles)) return true
  return false
}

function getBatchPosition(tiles: TileInt[]): BatchPositionInt {
  return {
    start: tiles[0].position,
    end: tiles[tiles.length - 1].position,
  }
}

function create(tiles:TileInt[]): BatchInt {
  return {
    tiles,
    isValid: validate(tiles),
    position: getBatchPosition(tiles),
  }
}

export const Batch = {
  create,
}