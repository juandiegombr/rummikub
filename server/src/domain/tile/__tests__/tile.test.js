const TileService = require('../../../domain/tile')

it('should generate all the tiles', async () => {
  const tiles =  TileService.generateTiles()

  expect(tiles).toHaveLength(52)
  expect(tiles).toMatchSnapshot()
})

it('should shuffle the tiles', async () => {
  const tiles =  TileService.generateTiles()
  const shuffledTiles =  TileService.shuffle(tiles)

  expect(shuffledTiles).toHaveLength(52)
})