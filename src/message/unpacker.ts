import * as zlib from 'zlib'

export class Unpacker {
  readonly code: number
  private _bytes: Buffer
  private _offset = 0

  constructor(buffer: Buffer) {
    this._bytes = buffer
    this.code = this.uint32()
  }

  uint8() {
    return this._bytes.readUInt8(this._offset++)
  }

  bool() {
    return !!this.uint8()
  }

  uint32() {
    const int = this._bytes.readUInt32LE(this._offset)
    this._offset += 4
    return int
  }

  str() {
    const size = this.uint32()
    return this._bytes.toString('utf8', this._offset, (this._offset += size))
  }

  ip() {
    const ip = Array<number>(4)
    for (let i = 0; i < ip.length; i++) ip[i] = this.uint8()
    return ip.reverse().join('.')
  }

  decompress(cb: (err: Error | null, compressed: this) => void) {
    zlib.inflate(this._bytes.slice(this._offset), (err, res) => {
      this._bytes = Buffer.concat(
        [this._bytes.slice(0, this._offset), res],
        res.length + this._offset
      )
      cb(err, this)
    })
  }
}
