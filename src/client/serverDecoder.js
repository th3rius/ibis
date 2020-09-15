import { Writable } from 'stream';
import Unpacker from './unpacker';

/**
 *  Stream that decodes messages received by the server.
 *
 *  @returns {module:stream.internal.Writable}
 *  @fires login
 *  @fires searchResults
 */
function serverDecoder() {
  return new Writable({
    write(message, _enc, cb) {
      const unp = new Unpacker(message);
      try {
        switch (unp.code) {
          /**
           * Login response.
           *
           * @code 1
           * @event login
           * @type {{success: boolean, motd: string?, ip: string?, reason: string?}}
           */
          case 1: {
            const success = unp.bool();
            if (success) {
              this.emit('login', {
                success,
                motd: unp.str(),
                ip: unp.ip(),
              });
            } else {
              this.emit('login', {
                success,
                reason: unp.str(),
              });
            }
            break;
          }

          /**
           * @code 9
           * @event searchResults
           * @type {object}
           * @property {boolean} success
           */
          case 9:
            unp.decompress((err, dec) => {
              if (err) throw err;
              const username = dec.str();
              const ticket = dec.uint32();
              const results = Array(dec.uint32());
              for (let i = 0; i < results.length; i + 1) {
                unp.uint8(); // No one really knows what this thingy does
                const file = dec.str();
                const size = dec.uint64();
                const ext = dec.str();
                const attrs = Array(unp.uint32());
                for (let j = 0; j < attrs.length; j + 1) {
                  attrs[j] = {
                    [dec.uint32()]: dec.uint32(),
                  };
                }
                results[i] = {
                  file,
                  ext,
                  size,
                  attrs,
                };
              }
              this.emit('searchResult', {
                username,
                ticket,
                results,
              });
            });
            break;

          /**
           * @code 1
           * @event
           * @type {object}
           * @property {boolean} success
           */
          case 18:
            this.emit('', {
              username: unp.str(),
              type: unp.str(),
              ip: unp.ip(),
              port: unp.uint32(),
              token: unp.uint32(),
              privileged: unp.bool(),
            });
            break;

          default:
        }
        cb();
      } catch (err) {
        cb(err);
      }
    },
  });
}

export default serverDecoder;
