import { describe, expect, it } from '@jest/globals';
import token from './token';

describe('token', () => {
  it('should return a valid number', () => {
    const val = token();
    expect(val).toBeGreaterThanOrEqual(0);
    expect(val).toBeLessThanOrEqual(2 ** 32 - 1);
  });
});
