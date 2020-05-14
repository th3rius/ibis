import { Writable } from 'stream'
import { Unpacker } from '../message/unpacker'

export const decoder = new Writable({
  write(message: Buffer, enc: string, done: () => void) {
    const u = new Unpacker(message)
    switch (u.code) {
      case 1: {
        const success = u.bool()
        if (success) {
          this.emit('login', {
            code: u.code,
            success,
            motd: u.str(),
            ip: u.ip()
          })
        } else {
          this.emit('login', { code: u.code, success, reason: u.str() })
          this.end((cb: () => void) => cb)
        }
        break
      }

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
        console.warn(`[unkown code]: ${u.code}`)
    }
    done()
  }
})
