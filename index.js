import { server } from './src/server.js'

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
})
