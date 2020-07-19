import zlib from 'zlib'

/**
 * Helper class that packs Soulseek messages according to the protocol.
 *
 * @see
 * {@link https://www.museek-plus.org/wiki/SoulseekProtocol#Packing Packing} for mor information.
 */
export class Packer {
  private _bytes: Buffer

  constructor(readonly code: number, private readonly byte?: boolean) {
    if (byte) {
      this._bytes = Buffer.alloc(1)
      this._bytes.writeUInt8(code)
    } else {
      this._bytes = Buffer.alloc(4)
      this._bytes.writeUInt32LE(code)
    }
  }

  uint32(int: number) {
    const buff = Buffer.alloc(4)
    buff.writeUInt32LE(int)
    this._bytes = Buffer.concat([this._bytes, buff])
    return this
  }

  uint64(int: number) {
    const buff = Buffer.alloc(8)
    buff.writeBigUInt64LE(BigInt(int))
    this._bytes = Buffer.concat([this._bytes, buff])
    return this
  }

  str(str: string) {
    const buff = Buffer.alloc(4 + str.length)
    buff.writeUInt32LE(str.length)
    buff.write(str, 4)
    this._bytes = Buffer.concat([this._bytes, buff])
    return this
  }

  compress(cb: (err: Error | null, compressed: this) => void) {
    // Don't compress the code
    const codeLen = this.byte ? 1 : 4
    zlib.deflate(this._bytes.slice(codeLen), (err, res) => {
      this._bytes = Buffer.concat([this._bytes.slice(0, codeLen), res])
      cb(err, this)
    })
  }

  get bytes() {
    const buff = Buffer.alloc(4)
    buff.writeUInt32LE(this._bytes.length)
    return Buffer.concat([buff, this._bytes])
  }
}
