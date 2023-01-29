import React from 'react'
import { useContext } from 'react'

const generateRandomKey = () => {
  return Math.floor(Math.random() * 10000)
}

let Storage

const createStorage = ({ onChange }) => {
  return {
    set: (key, value) => {
      localStorage.setItem(key, value)
      onChange()
    },
    get: (key) => {
      return localStorage.getItem(key)
    },
    clear: () => {
      localStorage.clear()
      onChange()
    },
  }
}

const StorageContext = React.createContext()

const StorageProvider = ({ children }) => {
  /* eslint-disable */
  const [refreshKey, setRefreshKey] = React.useState(generateRandomKey())

  Storage = createStorage({
    onChange: () => setRefreshKey(generateRandomKey()),
  })

  return (
    <StorageContext.Provider value={Storage}>
      {children}
    </StorageContext.Provider>
  )
}

const useStorage = () => {
  const Storage = useContext(StorageContext)

  return Storage
}

export { StorageProvider, useStorage, Storage }
