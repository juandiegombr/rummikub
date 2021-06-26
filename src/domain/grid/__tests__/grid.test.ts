import { Grid } from '../../grid'

test('should return the one batch', () => {
 const grid = [
   [{ color: 'red', value: 1 }]
  ]
  const batches = Grid.getGroups(grid)

  expect(batches).toHaveLength(1)
  expect(batches).toStrictEqual([
    [{ color: 'red', value: 1 }],
  ])
})

test('should return two batches', () => {
 const grid = [
   [{ color: 'red', value: 1 }, null, { color: 'red', value: 2 }]
  ]
  const batches = Grid.getGroups(grid)

  expect(batches).toHaveLength(2)
  expect(batches[0]).toStrictEqual(
    [{ color: 'red', value: 1 }],
   )
  expect(batches[1]).toStrictEqual(
    [{ color: 'red', value: 2 }],
   )
})

test('should return two combined batches', () => {
 const grid = [
   [{ color: 'red', value: 1 }, { color: 'red', value: 2 }, null, { color: 'red', value: 3}]
  ]
  const batches = Grid.getGroups(grid)

  expect(batches).toHaveLength(2)
  expect(batches[0]).toStrictEqual(
    [{ color: 'red', value: 1 }, { color: 'red', value: 2 }],
  )
  expect(batches[1]).toStrictEqual(
    [{ color: 'red', value: 3 }],
   )
})

test('should validate the batches', () => {
 const grid = [
   [
     { color: 'red', value: 1, position: { x: 0, y: 0 } },
     { color: 'red', value: 2, position: { x: 1, y: 0 } },
     null,
     { color: 'red', value: 3, position: { x: 3, y: 0 } },
    ]
  ]
  const batches = Grid.validate(grid)

  expect(batches).toStrictEqual([
    {
      tiles: [
        { color: 'red', value: 1, position: { x: 0, y: 0 } },
        { color: 'red', value: 2, position: { x: 1, y: 0 } },
      ],
      isValid: false,
      position: { start: { x: 0, y: 0 }, end: { x: 1, y: 0 }},
    },
    {
      tiles: [{ color: 'red', value: 3, position: { x: 3, y: 0 } }],
      isValid: false,
      position: { start: { x: 3, y: 0 }, end: { x: 3, y: 0 }},
    }
   ])
})