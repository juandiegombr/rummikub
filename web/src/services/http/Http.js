const get = (url, options) => {
  const path = `${process.env.REACT_APP_API_HOST}${url}`
  const request = new Request(path, { method: 'GET', ...options })
  return fetch(request)
}

export const Http = {
  get,
}