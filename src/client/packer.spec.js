import { describe, expect, it } from '@jest/globals';
import crypto from 'crypto';
import Packer from './packer';

describe('Packer', () => {
  it('should pack a login message', () => {
    const msg = Buffer.from(
      '480000000100000008000000757365726e616d650800000070617373776f7264b500000020000000643531633961376539333533373436613630323066393630326434353239323901000000',
      'hex',
    );
    const username = 'username';
    const password = 'password';
    const hash = crypto
      .createHash('md5')
      .update(username + password)
      .digest('hex');

    expect(
      new Packer(1)
        .str(username)
        .str(password)
        .uint32(181)
        .str(hash)
        .uint32(1)
        .msg(),
    ).toStrictEqual(msg);
  });
});
