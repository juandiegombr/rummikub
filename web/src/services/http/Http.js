import { Storage } from 'services/storage'

const get = (url, options) => {
  const path = `${process.env.REACT_APP_API_HOST}${url}`
  const request = new Request(path, {
    method: 'GET',
    headers: {
      'x-user-id': Storage.get('userId'),
      'Content-Type': 'application/json',
    },
    ...options,
  })
  return fetch(request)
}

const post = (url, options) => {
  const path = `${process.env.REACT_APP_API_HOST}${url}`

  const request = new Request(path, {
    method: 'POST',
    headers: {
      'x-user-id': Storage.get('userId'),
      'Content-Type': 'application/json',
    },
    ...options,
  })
  return fetch(request)
}

export const Http = {
  get,
  post,
}
