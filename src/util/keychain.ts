import * as keytar from "keytar";

class Keychain {
  constructor(readonly service = "ibis") {}

  setToken(account: string, token: string) {
    return keytar.setPassword(this.service, account, token);
  }

  getToken(account: string) {
    return keytar.getPassword(this.service, account);
  }

  deleteToken(account: string) {
    return keytar.deletePassword(this.service, account);
  }
}

export default Keychain;
