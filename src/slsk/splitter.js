import { Transform } from 'stream'

/*
 * Transform that splits or concatenates SoulSeek messages according to their
 * size.
 *
 * Note that the emitted messages will **not** contain the length chunk at the
 * beginning.
 */
export class Splitter extends Transform {
    _transform(chunk, enc, cb) {
        this._queue = this._queue ? Buffer.concat([this._queue, chunk]) : chunk
        try {
            this._split()
            cb()
        } catch (err) {
            cb(err)
        }
    }

    _split() {
        if (this._queue.length > 4) {
            // Are we reading a new message?
            this._size ??= this._queue.readUInt32LE() + 4
            // If we have enough bytes, emit the message and check again.
            // Otherwise, wait for more.
            if (this._size <= this._queue.length) {
                this.push(this._queue.slice(4, this._size))
                this._queue = this._queue.slice(this._size)
                this._size = null
                this._split()
            }
        }
    }
}
