import { Transform } from 'stream'

export const splitter = () => {
  let bytes: Buffer
  let size: number

  return new Transform({
    transform(chunk: Buffer, enc: string, done: () => void) {
      const split = () => {
        if (bytes.length > 4) {
          if (!size) size = bytes.readUInt32LE() + 4
          if (size <= bytes.length) {
            this.push(bytes.slice(4, size))
            bytes = bytes.slice(size)
            size = 0
            split()
          }
        }
      }

      bytes = bytes
        ? Buffer.concat([bytes, chunk], bytes.length + chunk.length)
        : chunk
      split()
      done()
    }
  })
}
