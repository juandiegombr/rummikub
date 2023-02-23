import { TileService } from '../../../domain/tile'

it('generates all the tiles', async () => {
  const tiles = TileService.generateTiles()

  expect(tiles).toHaveLength(106)
  expect(tiles).toMatchSnapshot()
})

it('shuffles the tiles', async () => {
  const tiles = TileService.generateTiles()
  const shuffledTiles = TileService.shuffle(tiles)

  expect(shuffledTiles).toHaveLength(106)
})
