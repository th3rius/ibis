import Packer from './packer';

/**
 *  These messages are used by clients to interface with the server. Internal
 *  Server messages are spooky and not understood, since the OSS crowd doesn't
 *  have access to it's source code.
 *
 * @see {@link https://www.museek-plus.org/wiki/SoulseekProtocol#ServerMessages Server Messages}
 */
const serverMessages = {
  /**
   * Log in to the server.
   *
   * @code 1
   * @param {string} username
   * @param {string} password
   * @returns {Buffer} Message
   */
  login(username, password) {
    return new Packer(1).str(username).str(password).uint32(182)
      .msg();
  },

  /**
   * The port you listen for peer connections.
   *
   * @code 2
   * @param {number} port
   * @returns {Buffer} Message
   */
  setListenPort(port) {
    return new Packer(2).uint32(port).msg();
  },

  /**
   * Request an user's IP address and port.
   *
   * @code 3
   * @param {string} username
   * @returns {Buffer} Message
   */
  getPeerAddr(username) {
    return new Packer(3).str(username).msg();
  },

  /**
   * Watch an user's status.
   *
   * @code 5
   * @param {string} username
   * @returns {Buffer} Message
   */
  watchUser(username) {
    return new Packer(5).str(username).msg();
  },

  /**
   * Request an user's status.
   *
   * @code 7
   * @param {string} username
   * @returns {Buffer} Message
   */
  getStatus(username) {
    return new Packer(7).str(username).msg();
  },

  /**
   * Send a message in a room.
   *
   * @code 13
   * @param {string} room
   * @param {string} message
   * @returns {Buffer} Message
   */
  sendRoomMsg(room, message) {
    return new Packer(13).str(room).str(message).msg();
  },

  /**
   * Join a room.
   *
   * @code 14
   * @param {string} room
   * @returns {Buffer} Message
   */
  joinRoom(room) {
    return new Packer(14).str(room).msg();
  },

  /**
   * Leave a room.
   *
   * @code 15
   * @param {string} room
   * @returns {Buffer} Message
   */
  leaveRoom(room) {
    return new Packer(15).str(room).msg();
  },

  /**
   * Notify the server that an attempt to connect to a peer failed, so the
   * peer can initialize the connection instead.
   *
   * @code 18
   * @param {number} token
   * @param  {string} username
   * @param {string} type
   * @returns {Buffer} Message
   */
  connectToPeer(token, username, type) {
    return new Packer(18).uint32(token).str(username).str(type)
      .msg();
  },

  /**
   * Send a message to an user.
   *
   * @code 22
   * @param {string} username
   * @param {string} message
   * @returns {Buffer} Message
   */
  sendPrivateMsg(username, message) {
    return new Packer(22).str(username).str(message).msg();
  },

  /**
   * Acknowledge that you received a private message. If you don't send this,
   * the server will keep spamming the message to you.
   *
   * @code 23
   * @param {number} id - The message ID.
   * @returns {Buffer} Message
   */
  ackMsg(id) {
    return new Packer(23).uint32(id).msg();
  },

  /**
   * Query for files.
   *
   * @code 26
   * @param {number} ticket - A number used to track the search results.
   * @param  {string} query
   * @returns {Buffer} Message
   */
  search(ticket, query) {
    return new Packer(26).uint32(ticket).str(query).msg();
  },

  /**
   * Set your online status.
   *
   * @code 28
   * @param {number} status
   * @returns {Buffer} Message
   */
  setStatus(status) {
    return new Packer(28).uint32(status).msg();
  },

  /**
   * Test the connection.
   *
   * @code 32
   * @returns {Buffer} Message
   */
  ping() {
    return new Packer(32).msg();
  },

  /**
   * Tell the server the files you want to share.
   *
   * @code 35
   * @param {number} folders
   * @param {number} files
   * @returns {Buffer} Message
   */
  setSharedFolders(folders, files) {
    return new Packer(35).uint32(folders).uint32(files).msg();
  },

  /**
   *  Search a specific user's shares.
   *
   * @code 42
   * @param {string} username
   * @param {number} ticket - A number used to track the search results.
   * @param {string} query
   * @returns {Buffer} Message
   */
  searchFromUser(username, ticket, query) {
    return new Packer(42).str(username).uint32(ticket).str(query)
      .msg();
  },

  /**
   * Add an item to your liked interests.
   *
   * @code 51
   * @param {string} item
   * @returns {Buffer} Message
   */
  like(item) {
    return new Packer(51).str(item).msg();
  },

  /**
   * Remove an item from liked interests.
   *
   * @code 52
   * @param {string} item
   * @returns {Buffer} Message
   */
  unlike(item) {
    return new Packer(52).str(item).msg();
  },

  /**
   * Request your list of recommendations.
   *
   * @code 54
   * @returns {Buffer} Message
   */
  getRecommendations() {
    return new Packer(54).msg();
  },

  /**
   * @code 56
   * @returns {Buffer} Message
   */
  getGlobalRecommendations() {
    return new Packer(56).msg();
  },

  /**
   * Get an user's liked and hated items.
   *
   * @code 57
   * @param {string} username
   * @returns {Buffer} Message
   */
  getUserLikes(username) {
    return new Packer(57).str(username).msg();
  },

  /**
   * Request the list of rooms.
   *
   * @code 64
   * @returns {Buffer} Message
   */
  getRooms() {
    return new Packer(64).msg();
  },

  /**
   * Request a list of privileged users.
   *
   * @code 69
   * @returns {Buffer} Message
   */
  getPrivilegedUsers() {
    return new Packer(69).msg();
  },
};

export default serverMessages;
