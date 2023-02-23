export const withNetwork = (responses) => {
  global.fetch = jest.fn((request) => {
    const mockedResponse = getResponseForRequest(request, responses)
    const response = createResponse(mockedResponse)
    return Promise.resolve(response)
  })
}

const createResponse = (response) => {
  if (!response) {
    return {
      json: () => Promise.resolve(),
      status: 200,
    }
  }

  if (!response.responseBody) {
    return {
      json: () => Promise.resolve(),
      status: response.status || 200,
    }
  }

  return {
    json: () => Promise.resolve(response.responseBody),
    status: response.status || 200,
  }
}

const getResponseForRequest = (request, responses) => {
  return responses.find((response) => request.url.includes(response.url))
}
