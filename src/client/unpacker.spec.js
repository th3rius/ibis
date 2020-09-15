import { describe, expect, it } from '@jest/globals';
import Unpacker from './unpacker';

describe('Unpacker', () => {
  it('should unpack a login response', () => {
    const msg = Buffer.from(
      '01000000010c000000686579207468657265203a700100007f',
      'hex',
    );
    const unp = new Unpacker(msg);

    expect({
      code: unp.code,
      success: unp.bool(),
      motd: unp.str(),
      ip: unp.ip(),
    }).toStrictEqual({
      code: 1,
      success: true,
      motd: 'hey there :p',
      ip: '127.0.0.1',
    });
  });
});
