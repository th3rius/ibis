export class Packer {
  private _bytes: Buffer

  constructor(readonly code: number, byte?: boolean) {
    if (byte) {
      this._bytes = Buffer.allocUnsafe(1)
      this._bytes.writeUInt8(code)
    } else {
      this._bytes = Buffer.allocUnsafe(4)
      this._bytes.writeUInt32LE(code)
    }
  }

  writeInt(int: number) {
    const buff = Buffer.allocUnsafe(4)
    buff.writeUInt32LE(int)
    this._bytes = Buffer.concat(
      [this._bytes, buff],
      this._bytes.length + buff.length
    )
    return this
  }

  writeStr(str: string) {
    const buff = Buffer.allocUnsafe(4 + str.length)
    buff.writeUInt32LE(str.length)
    buff.write(str, 4)
    this._bytes = Buffer.concat(
      [this._bytes, buff],
      this._bytes.length + buff.length
    )
    return this
  }

  get bytes() {
    const buff = Buffer.allocUnsafe(4)
    buff.writeUInt32LE(this._bytes.length)
    return Buffer.concat([buff, this._bytes], buff.length + this._bytes.length)
  }
}
