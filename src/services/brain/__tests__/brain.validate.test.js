import { Brain } from '../brain'

it('invalidate an empty grid', () => {
  const isValid = Brain.validate({ newCommonTiles: [] })

  expect(isValid).toBeFalsy()
})

it('invalidates a group less than three tiles', () => {
  const isValid = Brain.validate({
    newCommonTiles: [
      { color: 'orange', value: 1, spotY: 1, spotX: 1 },
      { color: 'red', value: 1, spotY: 1, spotX: 2 },
    ],
    userTiles: [{ color: 'orange', value: 1, spotY: 1, spotX: 1 }],
  })

  expect(isValid).toBeFalsy()
})

it('validates a value group with unique colors', () => {
  const isValid = Brain.validate({
    newCommonTiles: [
      { color: 'orange', value: 1, spotY: 1, spotX: 1 },
      { color: 'red', value: 1, spotY: 1, spotX: 2 },
      { color: 'black', value: 1, spotY: 1, spotX: 3 },
      { color: 'blue', value: 1, spotY: 1, spotX: 4 },
    ],
    userTiles: [{ color: 'orange', value: 1, spotY: 1, spotX: 1 }],
  })

  expect(isValid).toBeTruthy()
})

it('validates a value group with unique colors and bonus tile', () => {
  const isValid = Brain.validate({
    newCommonTiles: [
      { color: 'bonus', value: 0, spotY: 1, spotX: 1 },
      { color: 'red', value: 1, spotY: 1, spotX: 2 },
      { color: 'orange', value: 1, spotY: 1, spotX: 3 },
      { color: 'blue', value: 1, spotY: 1, spotX: 4 },
    ],
    userTiles: [{ color: 'bonus', value: 0, spotY: 1, spotX: 1 }],
  })

  expect(isValid).toBeTruthy()
})

it('invalidates a value group with duplicated colors', () => {
  const isValid = Brain.validate({
    newCommonTiles: [
      { color: 'red', value: 1, spotY: 1, spotX: 1 },
      { color: 'red', value: 1, spotY: 1, spotX: 2 },
      { color: 'black', value: 1, spotY: 1, spotX: 3 },
      { color: 'blue', value: 1, spotY: 1, spotX: 4 },
    ],
    userTiles: [{ color: 'red', value: 1, spotY: 1, spotX: 1 }],
  })

  expect(isValid).toBeFalsy()
})

it('validates a stair group with unique colors', () => {
  const isValid = Brain.validate({
    newCommonTiles: [
      { color: 'red', value: 1, spotY: 1, spotX: 1 },
      { color: 'red', value: 2, spotY: 1, spotX: 2 },
      { color: 'red', value: 3, spotY: 1, spotX: 3 },
      { color: 'red', value: 4, spotY: 1, spotX: 4 },
    ],
    userTiles: [{ color: 'red', value: 1, spotY: 1, spotX: 1 }],
  })

  expect(isValid).toBeTruthy()
})

it('validates a stair group with unique colors and bonus tile', () => {
  const isValid = Brain.validate({
    newCommonTiles: [
      { color: 'bonus', value: 0, spotY: 1, spotX: 1 },
      { color: 'red', value: 1, spotY: 1, spotX: 2 },
      { color: 'red', value: 3, spotY: 1, spotX: 3 },
      { color: 'red', value: 4, spotY: 1, spotX: 4 },
    ],
    userTiles: [{ color: 'red', value: 1, spotY: 1, spotX: 1 }],
  })

  expect(isValid).toBeTruthy()
})

it('validates a group with bonus tile in the middle', () => {
  const isValid = Brain.validate({
    newCommonTiles: [
      { color: 'red', value: 1, spotY: 1, spotX: 1 },
      { color: 'red', value: 2, spotY: 1, spotX: 2 },
      { color: 'bonus', value: 0, spotY: 1, spotX: 3 },
      { color: 'red', value: 4, spotY: 1, spotX: 4 },
    ],
    userTiles: [{ color: 'red', value: 1, spotY: 1, spotX: 1 }],
  })

  expect(isValid).toBeTruthy()
})

it('invalidate a stair group with different colors', () => {
  const isValid = Brain.validate({
    newCommonTiles: [
      { color: 'red', value: 1, spotY: 1, spotX: 1 },
      { color: 'black', value: 2, spotY: 1, spotX: 2 },
      { color: 'red', value: 3, spotY: 1, spotX: 3 },
      { color: 'red', value: 4, spotY: 1, spotX: 4 },
    ],
    userTiles: [{ color: 'red', value: 1, spotY: 1, spotX: 1 }],
  })

  expect(isValid).toBeFalsy()
})

it('invalidates the grid without player tiles', () => {
  const isValid = Brain.validate({
    newCommonTiles: [
      { id: 1, color: 'orange', value: 1, spotY: 1, spotX: 1 },
      { id: 2, color: 'red', value: 1, spotY: 1, spotX: 2 },
      { id: 3, color: 'black', value: 1, spotY: 1, spotX: 3 },
    ],
    userTiles: [{ id: 4, color: 'blue', value: 1, spotY: 1, spotX: 4 }],
  })

  expect(isValid).toBeFalsy()
})

it('invalidates the grid when the user has taken tiles from the common', () => {
  const isValid = Brain.validate({
    newCommonTiles: [
      { id: 1, color: 'orange', value: 10, spotY: 1, spotX: 1 },
      { id: 2, color: 'red', value: 10, spotY: 1, spotX: 2 },
      { id: 3, color: 'black', value: 10, spotY: 1, spotX: 3 },
    ],
    commonTiles: [
      { id: 1, color: 'orange', value: 10, spotY: 1, spotX: 1 },
      { id: 2, color: 'red', value: 10, spotY: 1, spotX: 2 },
      { id: 3, color: 'black', value: 10, spotY: 1, spotX: 3 },
      { id: 4, color: 'blue', value: 10, spotY: 1, spotX: 3 },
    ],
    userTiles: [{ id: 1, color: 'orange', value: 10, spotY: 1, spotX: 4 }],
  })

  expect(isValid).toBeFalsy()
})
