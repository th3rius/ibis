class Keychain {
  constructor(service = "ibis") {
    const keytar = require("keytar");
    if (!keytar) {
      throw new Error("System keychain unavailable");
    }
    this.keytar = keytar;
    this.service = service;
  }

  setToken(account, token) {
    return this.keytar.setPassword(this.service, account, token);
  }

  getToken(account) {
    return this.keytar.getPassword(this.service, account);
  }

  deleteToken(account) {
    return this.keytar.deletePassword(this.service, account);
  }
}

export default Keychain;
