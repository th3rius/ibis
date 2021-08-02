import {Transform} from "stream";

/**
 * Transform that delimits (splits and/or concatenates) streams of bytes.
 */
function splitter() {
  let queue = [];
  let queueLength = 0;
  let messageLength;

  function split(bytes) {
    // Are we reading a new message?
    if (messageLength) {
      // If we have enough bytes, emit the message and check again. Otherwise,
      // wait for more.
      if (queueLength >= messageLength) {
        const data = bytes ?? Buffer.concat(queue, queueLength);
        const message = data.slice(null, messageLength);
        const tail = data.slice(messageLength);
        queueLength -= messageLength;
        messageLength = null;
        queue = [tail];
        this.push(message);
        split.call(this, tail);
      }
    } else if (queueLength >= 4 /* sanity check */) {
      // We may receive multiple messages in a single chunk
      const data = bytes ?? Buffer.concat(queue, queueLength);
      messageLength = data.readUInt32LE() + 4;
      queue = [data];
      split.call(this, data);
    }
  }

  return new Transform({
    transform(chunk, encoding, callback) {
      queueLength += chunk.length;
      queue.push(chunk);
      split.call(this);
      callback();
    },
  });
}

export default splitter;
