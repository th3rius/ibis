import * as zlib from "zlib";
import * as util from "util";

const deflate = util.promisify(zlib.deflate);

/**
 * SoulSeek messages are packed according to the protocol using instances of the
 * Packer class. A message consists of a length header, a code and its body.
 * Content is appended to the message according to the packing order.
 */
class Packer {
  private readonly body: Buffer[];
  private bodyLength: number;

  constructor(code: number, byte = false) {
    let content;
    if (byte) {
      content = Buffer.allocUnsafe(1);
      content.writeUInt8(code);
    } else {
      content = Buffer.allocUnsafe(4);
      content.writeUInt32LE(code);
    }
    this.bodyLength = content.length;
    this.body = [content];
  }

  uint8(value: number) {
    const content = Buffer.allocUnsafe(1);
    content.writeUInt8(value);
    this.bodyLength += content.length;
    this.body.push(content);
    return this;
  }

  uint32(value: number) {
    const content = Buffer.allocUnsafe(4);
    content.writeUInt32LE(value);
    this.bodyLength += content.length;
    this.body.push(content);
    return this;
  }

  uint64(value: bigint) {
    const content = Buffer.allocUnsafe(8);
    content.writeBigUInt64LE(value);
    this.bodyLength += content.length;
    this.body.push(content);
    return this;
  }

  str(value: string) {
    const content = Buffer.allocUnsafe(4 + value.length);
    content.writeUInt32LE(value.length);
    content.write(value, content.length - value.length);
    this.bodyLength += content.length;
    this.body.push(content);
    return this;
  }

  msg() {
    // Includes the length header
    const header = Buffer.allocUnsafe(4);
    header.writeUInt32LE(this.bodyLength);
    return Buffer.concat(
      [header, ...this.body],
      header.length + this.bodyLength
    );
  }

  async msgCompressed() {
    const body = await deflate(Buffer.concat(this.body));
    const header = Buffer.allocUnsafe(4);
    header.writeUInt32LE(body.length);
    return Buffer.concat([header, body]);
  }
}

module.exports = Packer;
