const values = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

const generateGameCode = () => {
  const getRandomIndex = () => (Math.random() * values.length).toFixed()
  return Array.from({ length: 4 }).map(() => {
    return values[getRandomIndex()]
  }).join('')
}

module.exports = { generateGameCode }
