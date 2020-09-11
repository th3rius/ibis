import zlib from 'zlib';

/**
 * Helper class that packs SoulSeek messages according to the protocol.
 *
 * @see {@link https://www.museek-plus.org/wiki/SoulseekProtocol#Packing Packing}
 */
class Packer {
  /**
   * @param {number} code - The message code.
   * @param {boolean} [byte=false] - A boolean indicating whether the code is a single byte long
   */
  constructor(code, byte = false) {
    this.byte = byte;
    this.code = code;
    if (byte) {
      this.bytes = Buffer.alloc(1);
      this.bytes.writeUInt8(code);
    } else {
      this.bytes = Buffer.alloc(4);
      this.bytes.writeUInt32LE(code);
    }
  }

  /**
   * @param {number} int
   * @return {Packer}
   */
  uint32(int) {
    const buff = Buffer.alloc(4);
    buff.writeUInt32LE(int);
    this.bytes = Buffer.concat([this.bytes, buff]);
    return this;
  }

  /**
   * @param {number} int
   * @return {Packer}
   */
  uint64(int) {
    const buff = Buffer.alloc(8);
    buff.writeBigUInt64LE(BigInt(int));
    this.bytes = Buffer.concat([this.bytes, buff]);
    return this;
  }

  /**
   * @param {string} str
   * @return {Packer}
   */
  str(str) {
    const buff = Buffer.alloc(4 + str.length);
    buff.writeUInt32LE(str.length);
    buff.write(str, 4);
    this.bytes = Buffer.concat([this.bytes, buff]);
    return this;
  }

  /** @callback cb */
  compress(cb) {
    // Don't compress the code
    const codeLen = this.byte ? 1 : 4;
    zlib.deflate(this.bytes.slice(codeLen), (err, res) => {
      this.bytes = Buffer.concat([this.bytes.slice(0, codeLen), res]);
      cb(err, this);
    });
  }

  /** @return {Buffer} */
  msg() {
    const buff = Buffer.alloc(4);
    buff.writeUInt32LE(this.bytes.length);
    return Buffer.concat([buff, this.bytes]);
  }
}

export default Packer;
