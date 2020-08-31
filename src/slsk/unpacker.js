import zlib from 'zlib'

/**
 * Helper class that unpacks SoulSeek messages according to the protocol.
 *
 * @see {@link https://www.museek-plus.org/wiki/SoulseekProtocol#Packing Packing}
 */
export class Unpacker {
    _off = 0

    /**
     * @param {Buffer} buffer
     * @param {boolean} [byte=false] - A boolean indicating that the code is a single byte long
     */
    constructor(buffer, byte = false) {
        this._bytes = buffer
        if (byte) {
            this.code = this._bytes.readUInt32LE(this._off)
            this._off += 4
        } else {
            this.code = this._bytes.readUInt8(this._off)
            this._off += 1
        }
    }

    /**
     * @return {boolean}
     */
    bool() {
        return !!this._bytes.readUInt8(this._off++)
    }

    /**
     * @return {number}
     */
    uint8() {
        return this._bytes.readUInt8(this._off++)
    }

    /**
     * @return {number}
     */
    uint32() {
        const int = this._bytes.readUInt32LE(this._off)
        this._off += 4
        return int
    }

    /**
     * @return {bigint}
     */
    uint64() {
        const int = this._bytes.readBigUInt64LE(this._off)
        this._off += 8
        return int
    }

    /**
     * @return {string}
     */
    str() {
        const size = this._bytes.readUInt32LE(this._off)
        return this._bytes.toString(
            'utf8',
            (this._off += 4),
            (this._off += size)
        )
    }

    /**
     * @return {string}
     */
    ip() {
        const ip = Array(4)
        for (let i = 0; i < ip.length; i++)
            ip[i] = this._bytes.readUInt8(this._off++)
        return ip.reverse().join('.')
    }

    /**
     * @callback cb
     */
    decompress(cb) {
        zlib.inflate(this._bytes.slice(this._off), (err, res) => {
            this._bytes = Buffer.concat([this._bytes.slice(0, this._off), res])
            cb(err, this)
        })
    }
}
