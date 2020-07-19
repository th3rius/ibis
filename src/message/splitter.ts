import { Transform, TransformCallback } from 'stream'

/**
 * Transform that splits or concatenates Soulseek messages according to their
 * size.
 *
 * Note that the emitted messages will **not** contain the length chunk at the
 * beggining.
 *
 * @see
 * {@link https://www.museek-plus.org/wiki/SoulseekProtocol#ServerMessages Server Messages} for more information.
 */
export class Splitter extends Transform {
  private queue!: Buffer
  private size?: number

  _transform(chunk: Buffer, _enc: string, cb: TransformCallback) {
    this.queue = this.queue ? Buffer.concat([this.queue, chunk]) : chunk
    this.split()
    cb()
  }

  private split() {
    const sizeLen = 4
    if (this.queue.length > sizeLen) {
      // Are we reading a new message?
      if (!this.size) this.size = this.queue.readUInt32LE() + sizeLen
      // If we have enough bytes, emit the message and check again. Otherwise,
      // wait for more.
      if (this.size <= this.queue.length) {
        this.push(this.queue.slice(sizeLen, this.size))
        this.queue = this.queue.slice(this.size)
        this.size = undefined
        this.split()
      }
    }
  }
}
