let io = null

const setIo = (ioInstance) => {
  io = ioInstance
}

const getIo = () => io

export { setIo, getIo }
