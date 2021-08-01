const get = (url, options) => {
  const request = new Request(url, { method: 'GET', ...options })
  return fetch(request)
}

export const Http = {
  get,
}