import Packer from './packer';

/**
 * In museekd 0.1.13, these messages are sent and received in
 * Museek/PeerConnection?.cc and defined in Museek/PeerMessages?.hh. Since
 * museekd 0.2, they are defined in museekd/peermessages.h.
 *
 * @see {@link https://www.museek-plus.org/wiki/SoulseekProtocol#ServerMessages Server Messages}
 */
const peerMessages = {
  /**
   * @code 0
   * @param {number} token
   * @returns {Buffer} Message
   */
  pierceFirewall(token) {
    return new Packer(0, true).uint32(token).msg();
  },

  /**
   * @code 1
   * @param {string} username
   * @param {string} type
   * @param {number} token
   * @returns {Buffer} Message
   */
  peerInit(username, type, token) {
    return new Packer(1, true).str(username).str(type).uint32(token)
      .msg();
  },
};

export default peerMessages;
