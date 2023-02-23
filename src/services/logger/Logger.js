const Logger = {
  send: (message, data) => {
    if (data) {
      console.log(message, data)
    }
    console.log(message)
  },
}

export { Logger }
