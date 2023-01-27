export const withNetwork = (responses) => {
  global.fetch = jest.fn((request) => {
    const mockedResponse = getResponseForRequest(request, responses)
    const response = createResponse(mockedResponse)
    return Promise.resolve(response)
  })
}

const createResponse = (response) => {
  const options = { status: response.status || 200 }

  if (!response.responseBody) {
    return new Response(null, options)
  }

  const blob = new Blob([JSON.stringify(response.responseBody, null, 2)], {
    type: 'application/json',
  })
  return new Response(blob, options)
}

const getResponseForRequest = (request, responses) => {
  /* eslint-disable */ console.log('request', request.url)
  return responses.find((response) => request.url.includes(response.url))
}
