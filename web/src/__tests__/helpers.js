export const withNetwork = (responseBody) => {
  const blob = new Blob(
    [ JSON.stringify(responseBody, null, 2) ],
    { type : 'application/json' },
  )
  const options = { status: 200 }
  const response = new Response(blob, options)
  global.fetch = jest.fn(() => Promise.resolve(response))
}