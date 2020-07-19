import zlib from 'zlib'

export class Unpacker {
  readonly code: number
  private _bytes: Buffer
  private _off = 0

  constructor(buffer: Buffer) {
    this._bytes = buffer
    this.code = this._bytes.readUInt32LE(this._off)
    this._off += 4
  }

  bool() {
    return !!this._bytes.readUInt8(this._off++)
  }

  uint8() {
    return this._bytes.readUInt8(this._off++)
  }

  uint32() {
    const int = this._bytes.readUInt32LE(this._off)
    this._off += 4
    return int
  }

  uint64() {
    const int = this._bytes.readBigUInt64LE(this._off)
    this._off += 8
    return int
  }

  str() {
    const size = this._bytes.readUInt32LE(this._off)
    return this._bytes.toString('utf8', (this._off += 4), (this._off += size))
  }

  ip() {
    return Array.from({ length: 4 }, () => this._bytes.readUInt8(this._off++))
      .reverse()
      .join('.')
  }

  decompress(cb: (err: Error | null, decompressed: this) => void) {
    zlib.inflate(this._bytes.slice(this._off), (err, res) => {
      this._bytes = Buffer.concat([this._bytes.slice(0, this._off), res])
      cb(err, this)
    })
  }
}
