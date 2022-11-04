const { Brain } = require('../brain')

it('invalidate an empty grid', () => {
  const isValid = Brain.validate([])

  expect(isValid).toBeFalsy()
})

it('invalidates a group less than three tiles', () => {
  const isValid = Brain.validate([
    { color: 'orange', value: 1, spotY: 1, spotX: 1 },
    { color: 'red', value: 1, spotY: 1, spotX: 2 },
  ])

  expect(isValid).toBeFalsy()
})

it('validates a value group with unique colors', () => {
  const isValid = Brain.validate([
    { color: 'orange', value: 1, spotY: 1, spotX: 1 },
    { color: 'red', value: 1, spotY: 1, spotX: 2 },
    { color: 'black', value: 1, spotY: 1, spotX: 3 },
    { color: 'blue', value: 1, spotY: 1, spotX: 4 },
  ])

  expect(isValid).toBeTruthy()
})

it('validates a value group with unique colors and bonus tile', () => {
  const isValid = Brain.validate([
    { color: 'bonus', value: 0, spotY: 1, spotX: 1 },
    { color: 'red', value: 1, spotY: 1, spotX: 2 },
    { color: 'orange', value: 1, spotY: 1, spotX: 3 },
    { color: 'blue', value: 1, spotY: 1, spotX: 4 },
  ])

  expect(isValid).toBeTruthy()
})

it('invalidates a value group with duplicated colors', () => {
  const isValid = Brain.validate([
    { color: 'red', value: 1, spotY: 1, spotX: 1 },
    { color: 'red', value: 1, spotY: 1, spotX: 2 },
    { color: 'black', value: 1, spotY: 1, spotX: 3 },
    { color: 'blue', value: 1, spotY: 1, spotX: 4 },
  ])

  expect(isValid).toBeFalsy()
})

it('validates a stair group with unique colors', () => {
  const isValid = Brain.validate([
    { color: 'red', value: 1, spotY: 1, spotX: 1 },
    { color: 'red', value: 2, spotY: 1, spotX: 2 },
    { color: 'red', value: 3, spotY: 1, spotX: 3 },
    { color: 'red', value: 4, spotY: 1, spotX: 4 },
  ])

  expect(isValid).toBeTruthy()
})

it('validates a stair group with unique colors and bonus tile', () => {
  const isValid = Brain.validate([
    { color: 'bonus', value: 0, spotY: 1, spotX: 1 },
    { color: 'red', value: 1, spotY: 1, spotX: 2 },
    { color: 'red', value: 3, spotY: 1, spotX: 3 },
    { color: 'red', value: 4, spotY: 1, spotX: 4 },
  ])

  expect(isValid).toBeTruthy()
})

it('invalidate a stair group with different colors', () => {
  const isValid = Brain.validate([
    { color: 'red', value: 1, spotY: 1, spotX: 1 },
    { color: 'black', value: 2, spotY: 1, spotX: 2 },
    { color: 'red', value: 3, spotY: 1, spotX: 3 },
    { color: 'red', value: 4, spotY: 1, spotX: 4 },
  ])

  expect(isValid).toBeFalsy()
})