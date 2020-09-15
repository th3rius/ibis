import {
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { PassThrough } from 'stream';
import splitter from './splitter';

describe('splitter', () => {
  it('should fire 4 messages', () => {
    const mockCb = jest.fn();
    const stream = new PassThrough();
    stream.pipe(splitter()).on('data', mockCb);
    // Full message
    stream.write(Buffer.from(`48000000${'00'.repeat(0x48)}`, 'hex'));
    // Split it in half
    stream.write(Buffer.from(`24000000${'00'.repeat(0x24)}`, 'hex'));
    stream.write(Buffer.from('00'.repeat(0x24), 'hex'));
    // Two at once
    stream.write(
      Buffer.from(
        `32000000${'00'.repeat(0x32)}46000000${'00'.repeat(0x46)}`,
        'hex',
      ),
    );
    // Don't finish
    stream.write(Buffer.from('02000000'));

    expect(mockCb).toBeCalledTimes(4);
  });
});
