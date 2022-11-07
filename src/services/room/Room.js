const DB = require('../../db')
const { Game, Tile, User } = require('../../models')

let io = null

function init(instance) {
  return io = instance
}

function getById(socketId) {
  const ids = await io.in(room).allSockets()
  return [...ids].map((id) => {
    return Socket.getById(id)
  })
}

function getId(socket) {
  return socket.handshake.auth.token
}

const Room = {
  init,
  getById,
  getId,

module.exports = { Room }
