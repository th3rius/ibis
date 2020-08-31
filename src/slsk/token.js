/**
 * Generate a random token between 0 and (2 ^ 32) -1.
 *
 * @return {number}
 */
export function token() {
    return Math.floor(Math.random() * Math.pow(2, 32) - 1)
}
