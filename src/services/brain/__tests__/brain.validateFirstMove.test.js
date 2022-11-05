const { Brain } = require('../brain')

it('validates first move with more than 30', () => {
  const isValid = Brain.validate({
    commonTiles: [
      { id: 1, color: 'orange', value: 10, spotY: 1, spotX: 1 },
      { id: 2, color: 'red', value: 10, spotY: 1, spotX: 2 },
      { id: 3, color: 'black', value: 10, spotY: 1, spotX: 3 },
    ],
    userTiles: [
      { id: 1, color: 'orange', value: 10, spotY: 1, spotX: 1 },
      { id: 2, color: 'red', value: 10, spotY: 1, spotX: 2 },
      { id: 3, color: 'black', value: 10, spotY: 1, spotX: 3 },
    ],
    isFirstMove: true,
  })

  expect(isValid).toBeTruthy()
})

it('validates first move with more than 30 and bonus tile', () => {
  const isValid = Brain.validate({
    commonTiles: [
      { id: 1, color: 'orange', value: 10, spotY: 1, spotX: 1 },
      { id: 2, color: 'bonus', value: 0, spotY: 1, spotX: 2 },
      { id: 3, color: 'black', value: 10, spotY: 1, spotX: 3 },
    ],
    userTiles: [
      { id: 1, color: 'orange', value: 10, spotY: 1, spotX: 1 },
      { id: 2, color: 'red', value: 10, spotY: 1, spotX: 2 },
      { id: 3, color: 'black', value: 10, spotY: 1, spotX: 3 },
    ],
    isFirstMove: true,
  })

  expect(isValid).toBeTruthy()
})

it('validates first move with more than 30 and bonus tile in the middle', () => {
  const isValid = Brain.validate({
    commonTiles: [
      { id: '1', value: 10, color: 'blue', spotX: 3, spotY: 3 },
      { id: '2', value: 0, color: 'bonus', spotX: 4, spotY: 3 },
      { id: '3', value: 10, color: 'red', spotX: 5, spotY: 3 },
    ],
    userTiles: [
      { id: '1', value: 10, color: 'blue', spotX: 3, spotY: 3 },
      { id: '2', value: 0, color: 'bonus', spotX: 4, spotY: 3 },
      { id: '3', value: 10, color: 'red', spotX: 5, spotY: 3 },
    ],
    isFirstMove: true,
  })

  expect(isValid).toBeTruthy()
})

it('validates first move with more than 30 and bonus tile in the middle', () => {
  const isValid = Brain.validate({
    commonTiles: [
      { id: 1, color: 'orange', value: 10, spotY: 1, spotX: 1 },
      { id: 2, color: 'bonus', value: 0, spotY: 1, spotX: 2 },
      { id: 3, color: 'orange', value: 12, spotY: 1, spotX: 3 },
    ],
    userTiles: [
      { id: 1, color: 'orange', value: 10, spotY: 1, spotX: 1 },
      { id: 2, color: 'bonus', value: 0, spotY: 1, spotX: 2 },
      { id: 3, color: 'orange', value: 12, spotY: 1, spotX: 3 },
    ],
    isFirstMove: true,
  })

  expect(isValid).toBeTruthy()
})

it('invalidates first move with more than 30 but not user tiles', () => {
  const isValid = Brain.validate({
    commonTiles: [
      { id: 1, color: 'orange', value: 10, spotY: 1, spotX: 1 },
      { id: 2, color: 'red', value: 10, spotY: 1, spotX: 2 },
      { id: 3, color: 'black', value: 10, spotY: 1, spotX: 3 },
    ],
    userTiles: [],
    isFirstMove: true,
  })

  expect(isValid).toBeFalsy()
})

it('invalidates first move with less than 30', () => {
  const isValid = Brain.validate({
    commonTiles: [
      { id: 1, color: 'orange', value: 1, spotY: 1, spotX: 1 },
      { id: 2, color: 'red', value: 1, spotY: 1, spotX: 2 },
      { id: 3, color: 'black', value: 1, spotY: 1, spotX: 3 },
    ],
    userTiles: [
      { id: 1, color: 'orange', value: 1, spotY: 1, spotX: 1 },
      { id: 2, color: 'red', value: 1, spotY: 1, spotX: 2 },
      { id: 3, color: 'black', value: 1, spotY: 1, spotX: 3 },
    ],
    isFirstMove: true,
  })

  expect(isValid).toBeFalsy()
})

it('invalidates first move with more than 30 and without player tiles', () => {
  const isValid = Brain.validate({
    commonTiles: [
      { id: 1, color: 'orange', value: 10, spotY: 1, spotX: 1 },
      { id: 2, color: 'red', value: 10, spotY: 1, spotX: 2 },
      { id: 3, color: 'black', value: 10, spotY: 1, spotX: 3 },
      { id: 4, color: 'blue', value: 10, spotY: 1, spotX: 4 },
    ],
    userTiles: [
      { id: 4, color: 'blue', value: 10, spotY: 1, spotX: 4 },
    ],
    isFirstMove: true,
  })

  expect(isValid).toBeFalsy()
})