/**
 * Generates a random token between 0 and (2 ^ 32) -1.
 *
 * @return {number}
 */
function token() {
  return Math.floor(Math.random() * 2 ** 32) - 1;
}

export default token;
