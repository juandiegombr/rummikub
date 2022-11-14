const { v4 } = require('uuid')
const { TileService } = require('../domain/tile')
const { generateGameCode } = require('../helpers')

class Model {
  constructor() {
    this.tableName = this.constructor.name.replace('Model', '').toUpperCase()
    this[this.tableName] = {}
    this.foreignKeys = []
    this.initForeignKeys()
    this.injectForeignKeys = this.injectForeignKeys.bind(this)
  }

  create (obj = {}) {
    const TABLE = this[this.tableName]
    const id = v4()
    const entity = { id }
    Object.entries(this.fields).forEach(([key, field]) => {
      const value = obj[key] || field.default

      if (!value && field.allowNull) {
        entity[key] = null
        return
      }

      if (field.isForeignKey) {
        this.handleForeignKey(entity, key, value)
        return
      }
      entity[key] = field.validator(value)
    })
    TABLE[id] = entity
    return this.injectForeignKeys(entity)
  }

  update (entity, payload) {
    const TABLE = this[this.tableName]
    Object.entries(payload).forEach(([keyToUpdate, newValue]) => {
      const field = this.fields[keyToUpdate]
      if (field.isForeignKey) {
        this.handleForeignKey(entity, keyToUpdate, newValue)
        return
      }
      entity[keyToUpdate] = field.validator(newValue)
    })
    TABLE[entity.id] = entity
    return entity
  }

  get (query) {
    const TABLE = this[this.tableName]
    const entity = Object.values(TABLE).find((entity) => {
      const queryParams = Object.entries(query)
      return queryParams.every(([key, value]) => {
          return entity[key] === value
      })
    })
    if (!entity) return
    return this.injectForeignKeys(entity)
  }

  filter (query) {
    const TABLE = this[this.tableName]
    const entities = Object.values(TABLE).filter((entity) => {
      const queryParams = Object.entries(query)
      return queryParams.every(([key, value]) => {
          return entity[key] === value
      })
    })

    return entities.map(this.injectForeignKeys)
  }

  reset () {
    this[this.tableName] = {}
  }

  initForeignKeys () {
    Object.entries(this.fields).forEach(([key, validator]) => {
      const { isForeignKey, model, relatedName } = validator
      if (isForeignKey) {
        const selector = (entity) => {
          return this.filter({ [`${key}Id`]: entity.id })
        }
        model.foreignKeys.push({ relatedName, selector })
      }
    })
  }

  injectForeignKeys (obj) {
    const entity = {...obj}
    Object.entries(this.fields).forEach(([key, validator]) => {
      const { isForeignKey, model } = validator
      if (isForeignKey) {
        const selector = (entity) => {
          return model.get({ id: entity[`${key}Id`]  })
        }
        this.setSelector(entity, key, selector)
      }
    })
    this.foreignKeys.forEach(({ relatedName, selector }) => {
      this.setSelector(entity, relatedName, selector)
    })
    return entity
  }

  handleForeignKey (entity, key, value) {
    const foreignKey = value ? value['id'] : null
    entity[`${key}Id`] = foreignKey
    return
  }

  setSelector (obj, property, selector) {
    Object.defineProperty(obj,
      property,
      {
        enumerable: true,
        configurable: true,
        get() {
          return selector(this)
        },
      }
    )
  }
}

class GameModel extends Model {
  get fields () {
    return {
      code: { validator: String, default: generateGameCode() },
      turn: { validator: Number, default: 0 },
      rounds: { validator: Number, default: 1 },
      players: { validator: Number, default: 2 },
      points: { validator: Number, default: 50 },
    }
  }
}

class UserModel extends Model {
  get fields () {
    return {
      name: { validator: String },
      socketId: { validator: String, allowNull: true },
      isFirstMove: { validator: Boolean, default: true },
      order: { validator: Number, allowNull: true },
      game: { isForeignKey: true, relatedName: 'users', model: Game },
    }
  }
}

class TileModel extends Model {
  get fields () {
    return {
      code: { validator: String },
      value: { validator: Number },
      color: { validator: String },
      game: { isForeignKey: true, relatedName: 'tiles', model: Game },
      user: { isForeignKey: true, relatedName: 'tiles', model: User },
      area: { validator: String, allowNull: true },
      spotX: { validator: Number, allowNull: true },
      spotY: { validator: Number, allowNull: true },
    }
  }
}

class RoundModel extends Model {
  get fields () {
    return {
      number: { validator: Number },
      score: { validator: Number },
      game: { isForeignKey: true, relatedName: 'tiles', model: Game },
      user: { isForeignKey: true, relatedName: 'tiles', model: User },
    }
  }
}


const Game = new GameModel()
const User = new UserModel()
const Tile = new TileModel()
const Round = new RoundModel()

module.exports = {
  Game,
  User,
  Tile,
  Round,
}