import { Stream } from 'stream'

export class Splitter extends Stream.Writable {
  private _bytes: Buffer
  private _size: number

  split() {
    if (this._bytes.length > 4) {
      this._size = this._size ? this._size : this._bytes.readUInt32LE()
      if (this._size + 4 <= this._bytes.length) {
        this.emit('message', this._bytes.slice(4, this._size + 4))
        this._bytes = this._bytes.slice(this._size + 4)
        this._size = null
        this.split()
      }
    }
  }

  _write(data: Buffer, enc: string, next: () => void) {
    this._bytes = this._bytes
      ? Buffer.concat([this._bytes, data], this._bytes.length + data.length)
      : data
    this.split()
    next()
  }
}
