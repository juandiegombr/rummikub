const { server } = require('./src/server.js')

const PORT = process.env.PORT || 0

server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
});
