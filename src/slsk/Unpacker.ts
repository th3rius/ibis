import * as zlib from "zlib";
import * as util from "util";

const inflate = util.promisify(zlib.inflate);

/**
 * SoulSeek messages are read according to the protocol using instances of
 * the Unpacker class. A message consists of a length header, a code and its
 * body. Content is read to the message according to the unpacking order.
 */
export default class Unpacker {
  readonly code: number;
  private offset: number;

  constructor(private message: Buffer, byte = false) {
    this.offset = 4; // Ignore the message length
    // `byte` indicates whether the message code is a single-byte long.
    // For some convoluted reason that's the case with some peer messages.
    if (byte) {
      this.code = this.message.readUInt8(this.offset++);
    } else {
      this.code = this.message.readUInt32LE(this.offset);
      this.offset += 4;
    }
  }

  uint8() {
    return this.message.readUInt8(this.offset++);
  }

  bool() {
    return Boolean(this.message.readUInt8(this.offset++));
  }

  uint32() {
    const content = this.message.readUInt32LE(this.offset);
    this.offset += 4;
    return content;
  }

  ip() {
    return this.message
      .subarray(this.offset, (this.offset += 4))
      .reverse()
      .join(".");
  }

  uint64() {
    const content = this.message.readBigUInt64LE(this.offset);
    this.offset += 8;
    return content;
  }

  str() {
    const length = this.message.readUInt32LE(this.offset);
    return this.message.toString(
      "utf8",
      (this.offset += 4),
      (this.offset += length)
    );
  }

  /*
   * Decompresses zlib encoded messages *in-place*.
   */
  async decompress() {
    this.message = await inflate(this.message.subarray(this.offset));
    this.offset = 0;
  }
}
