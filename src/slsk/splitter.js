import { Transform } from 'stream';

/**
 * Transform that splits or concatenates SoulSeek messages according to their
 * size.
 *
 * Note that the emitted messages will **not** contain the length chunk at the
 * beginning.
 *
 * @returns {module:stream.internal.Transform}
 */
function splitter() {
  let queue;
  let size;

  return new Transform({
    transform(chunk, enc, cb) {
      const split = () => {
        if (queue.length > 4) {
          // Are we reading a new message?
          size ??= queue.readUInt32LE() + 4;
          // If we have enough bytes, emit the message and check again.
          // Otherwise, wait for more.
          if (size <= queue.length) {
            this.push(queue.slice(4, size));
            queue = queue.slice(size);
            size = null;
            split();
          }
        }
      };

      queue = queue ? Buffer.concat([queue, chunk]) : chunk;
      try {
        split();
        cb();
      } catch (err) {
        cb(err);
      }
    },
  });
}

export default splitter;
