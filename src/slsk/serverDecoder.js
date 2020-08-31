import { Transform } from 'stream'
import { Unpacker } from './unpacker'

export class ServerDecoder extends Transform {
    constructor() {
        super({ objectMode: true })
    }

    _transform(message, enc, cb) {
        const unp = new Unpacker(message)
        try {
            switch (unp.code) {
                case 1: {
                    const success = unp.bool()
                    if (success)
                        this.push({
                            code: unp.code,
                            success,
                            motd: unp.str(),
                            ip: unp.ip()
                        })
                    else
                        this.push({
                            code: unp.code,
                            success,
                            reason: unp.str()
                        })
                    break
                }

                case 9:
                    unp.decompress((err, dec) => {
                        if (err) throw err
                        const username = dec.str()
                        const ticket = dec.uint32()
                        const results = Array(dec.uint32())
                        for (let i = 0; i < results.length; i++) {
                            unp.uint8()
                            const file = dec.str()
                            const size = dec.uint64()
                            const ext = dec.str()
                            const attrs = Array(unp.uint32())
                            for (let j = 0; j < attrs.length; j++)
                                attrs[j] = {
                                    [dec.uint32()]: dec.uint32()
                                }
                            results[i] = { file, ext, size, attrs }
                        }
                        this.push({
                            code: dec.code,
                            username,
                            ticket,
                            results
                        })
                    })
                    break

                case 18:
                    this.push({
                        code: unp.code,
                        username: unp.str(),
                        type: unp.str(),
                        ip: unp.ip(),
                        port: unp.uint32(),
                        token: unp.uint32(),
                        privileged: unp.bool()
                    })
                    break
            }
            cb()
        } catch (err) {
            cb(err)
        }
    }
}
