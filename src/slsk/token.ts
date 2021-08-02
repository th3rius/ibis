// Generates a random token between 0 and (2 ^ 32) -1
function token() {
  return Math.floor(Math.random() * 0xffffffff);
}

export default token;
