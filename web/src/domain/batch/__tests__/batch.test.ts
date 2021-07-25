import { Batch, BatchInt } from '../../batch'

test('should validate a batch 1 tile', () => {
  const tiles = [
    { color: 'red', value: 1, position: { x: 0, y: 0 }},
  ]
  const batch: BatchInt = Batch.create(tiles)

  expect(batch.isValid).toBeFalsy()
})

test('should validate a batch 2 tiles', () => {
  const tiles = [
    { color: 'red', value: 1, position: { x: 0, y: 0 }},
    { color: 'red', value: 2, position: { x: 1, y: 0 }},
  ]
  const batch: BatchInt = Batch.create(tiles)

  expect(batch.isValid).toBeFalsy()
})

test('should validate a batch 3 tiles', () => {
  const tiles = [
    { color: 'red', value: 1, position: { x: 0, y: 0 }},
    { color: 'red', value: 2, position: { x: 1, y: 0 }},
    { color: 'red', value: 3, position: { x: 2, y: 0 }},
  ]
  const batch: BatchInt = Batch.create(tiles)

  expect(batch.isValid).toBeTruthy()
})

test('should validate the tiles values in stair combination', () => {
  const tiles = [
    { color: 'red', value: 1, position: { x: 0, y: 0 }},
    { color: 'red', value: 3, position: { x: 1, y: 0 }},
    { color: 'red', value: 2, position: { x: 2, y: 0 }},
  ]
  const batch: BatchInt = Batch.create(tiles)

  expect(batch.isValid).toBeFalsy()
})

test('should validate the tiles color in stair combination', () => {
  const tiles = [
    { color: 'red', value: 1, position: { x: 0, y: 0 }},
    { color: 'green', value: 2, position: { x: 1, y: 0 }},
    { color: 'red', value: 3, position: { x: 2, y: 0 }},
  ]
  const batch: BatchInt = Batch.create(tiles)

  expect(batch.isValid).toBeFalsy()
})

test('should validate the tiles values in value combination', () => {
  const tiles = [
    { color: 'red', value: 1, position: { x: 0, y: 0 }},
    { color: 'green', value: 1, position: { x: 1, y: 0 }},
    { color: 'yellow', value: 1, position: { x: 2, y: 0 }},
  ]
  const batch: BatchInt = Batch.create(tiles)

  expect(batch.isValid).toBeTruthy()
})

test('should validate the tiles colors in value combination', () => {
  const tiles = [
    { color: 'red', value: 1, position: { x: 0, y: 0 }},
    { color: 'red', value: 1, position: { x: 1, y: 0 }},
    { color: 'yellow', value: 1, position: { x: 2, y: 0 }},
  ]
  const batch: BatchInt = Batch.create(tiles)

  expect(batch.isValid).toBeFalsy()
})

test('should set the batch position', () => {
  const tiles = [
    { color: 'red', value: 1, position: { x: 0, y: 0 }},
    { color: 'red', value: 1, position: { x: 1, y: 0 }},
    { color: 'yellow', value: 1, position: { x: 2, y: 0 }},
  ]
  const batch: BatchInt = Batch.create(tiles)

  expect(batch.position).toStrictEqual({
    start: { x: 0, y: 0 },
    end: { x: 2, y: 0 },
  })
})