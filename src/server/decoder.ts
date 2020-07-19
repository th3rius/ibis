import { Writable } from 'stream'
import { Unpacker } from '../message/unpacker'

export const decoder = () => {
  return new Writable({
    write(message: Buffer, enc: string, done: () => void) {
      const u = new Unpacker(message)
      switch (u.code) {
        case 1: {
          const success = u.bool()
          if (success)
            this.emit('login', {
              code: u.code,
              success,
              motd: u.str(),
              ip: u.ip()
            })
          else
            this.emit('login', {
              code: u.code,
              success,
              reason: u.str()
            })
          break
        }

        case 9:
          u.decompress((err, dec) => {
            if (err) throw err
            const username = dec.str()
            const ticket = dec.uint32()
            const results = Array(dec.uint32())
            for (let i = 0; i < results.length; i++) {
              u.uint8()
              const file = dec.str()
              const size = dec.uint64()
              const ext = dec.str()
              const attrs = Array(u.uint32())
              for (let j = 0; j < attrs.length; j++)
                attrs[j] = {
                  [dec.uint32()]: dec.uint32()
                }
              results[i] = { file, ext, size, attrs }
            }
            this.emit('searchReply', {
              code: dec.code,
              username,
              ticket,
              results
            })
          })
          break

        case 18:
          this.emit('peer', {
            code: u.code,
            username: u.str(),
            type: u.str(),
            ip: u.ip(),
            port: u.uint32(),
            token: u.uint32(),
            privileged: u.bool()
          })
          break

        default:
        // console.log(`[unkown code]: ${u.code}`)
      }
      done()
    }
  })
}
