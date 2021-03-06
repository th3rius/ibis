import zlib from 'zlib';

/**
 * Helper class that unpacks SoulSeek messages according to the protocol.
 *
 * @see {@link https://www.museek-plus.org/wiki/SoulseekProtocol#Packing Packing}
 */
class Unpacker {
  /**
   * @param {Buffer} buffer
   * @param {boolean} [byte=false] - A boolean indicating whether the code is a single byte long
   */
  constructor(buffer, byte = false) {
    this.off = 0;
    this.bytes = buffer;
    if (byte) {
      this.code = this.bytes.readUInt8(this.off);
      this.off += 1;
    } else {
      this.code = this.bytes.readUInt32LE(this.off);
      this.off += 4;
    }
  }

  /** @returns {boolean} */
  bool() {
    const bool = !!this.bytes.readUInt8(this.off);
    this.off += 1;
    return bool;
  }

  /** @returns {number} */
  uint8() {
    const int = this.bytes.readUInt8(this.off);
    this.off += 1;
    return int;
  }

  /** @returns {number} */
  uint32() {
    const int = this.bytes.readUInt32LE(this.off);
    this.off += 4;
    return int;
  }

  /** @returns {bigint} */
  uint64() {
    const int = this.bytes.readBigUInt64LE(this.off);
    this.off += 8;
    return int;
  }

  /** @returns {string} */
  str() {
    const size = this.bytes.readUInt32LE(this.off);
    this.off += 4;
    const str = this.bytes.toString('utf8', this.off, this.off + size);
    this.off += size;
    return str;
  }

  /** @returns {string} */
  ip() {
    const ip = Array(4);
    for (let i = 0; i < ip.length; i += 1) {
      ip[i] = this.bytes.readUInt8(this.off);
      this.off += 1;
    }
    return ip.reverse().join('.');
  }

  /** @param {(err: Error?, decompressed: this) => void} cb */
  decompress(cb) {
    zlib.inflate(this.bytes.slice(this.off), (err, res) => {
      this.bytes = Buffer.concat([this.bytes.slice(0, this.off), res]);
      cb(err, this);
    });
  }
}

export default Unpacker;
