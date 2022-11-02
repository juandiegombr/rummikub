const get = (url, options) => {
  const path = `${process.env.REACT_APP_API_HOST}${url}`
  const request = new Request(path, { method: 'GET', headers: {
    'x-user-id': localStorage.userId,
    'Content-Type': 'application/json',
  }, ...options })
  return fetch(request)
}

const post = (url, options) => {
  const path = `${process.env.REACT_APP_API_HOST}${url}`

  const request = new Request(path, { method: 'POST', headers: {
    'Content-Type': 'application/json',
  }, ...options })
  return fetch(request)
}

export const Http = {
  get,
  post,
}