/**
 *  These messages are used by clients to interface with the server. Internal
 *  Server messages are spooky and not understood, since the OSS crowd doesn't
 *  have access to it's source code.
 *
 * @module serverMessages
 * @see {@link https://www.museek-plus.org/wiki/SoulseekProtocol#ServerMessages Server Messages}
 */
import { Packer } from './packer'

/**
 * Log in to the server.
 *
 * @code 1
 * @param {string} username
 * @param {string} password
 * @returns {Buffer}
 */
export function login(username, password) {
    return new Packer(1).str(username).str(password).uint32(182).bytes
}

/**
 * The port you listen for peer connections.
 *
 * @code 2
 * @param {number} port
 * @returns {Buffer}
 */
export function setListenPort(port) {
    return new Packer(2).uint32(port).bytes
}

/**
 * Request an user's IP address and port.
 *
 * @code 3
 * @param {string} username
 * @return {Buffer}
 */
export function getPeerAddr(username) {
    return new Packer(3).str(username).bytes
}

/**
 * Watch an user's status.
 *
 * @code 5
 * @param {string} username
 * @return {Buffer}
 */
export function watchUser(username) {
    return new Packer(5).str(username).bytes
}

/**
 * Request an user's status.
 *
 * @code 7
 * @param {string} username
 * @return {Buffer}
 */
export function getStatus(username) {
    return new Packer(7).str(username).bytes
}

/**
 * Send a message in a room.
 *
 * @code 13
 * @param {string} room
 * @param {string} message
 * @return {Buffer}
 */
export function sendRoomMsg(room, message) {
    return new Packer(13).str(room).str(message).bytes
}

/**
 * Join a room.
 *
 * @code 14
 * @param room
 * @return {Buffer}
 */
export function joinRoom(room) {
    return new Packer(14).str(room).bytes
}

/**
 * Leave a room.
 *
 * @code 15
 * @param room
 * @return {Buffer}
 */
export function leaveRoom(room) {
    return new Packer(15).str(room).bytes
}

/**
 * Notify the server that an attempt to connect to a peer failed, so the
 * peer can initialize the connection instead.
 *
 * @code 18
 * @param {number} token
 * @param  {string} username
 * @param {string} type
 * @return {Buffer}
 */
export function connectToPeer(token, username, type) {
    return new Packer(18).uint32(token).str(username).str(type).bytes
}

/**
 * Send a message to a peer.
 *
 * @code 22
 * @param {string} username
 * @param {string} message
 * @return {Buffer}
 */
export function sendPrivateMsg(username, message) {
    return new Packer(22).str(username).str(message).bytes
}

/**
 * Acknowledge that you received a private message. If you don't send this,
 * the server will keep spamming the message to you.
 *
 * @code 23
 * @param {number} id - The message ID.
 * @return {Buffer}
 */
export function ackMsg(id) {
    return new Packer(23).uint32(id).bytes
}

/**
 * Query for files.
 *
 * @code 26
 * @param {number} ticket - A number used to track the search results.
 * @param  {string} query
 * @return {Buffer}
 */
export function search(ticket, query) {
    return new Packer(26).uint32(ticket).str(query).bytes
}

/**
 * Set your online status.
 *
 * @code 28
 * @param status
 * @return {Buffer}
 */
export function setStatus(status) {
    return new Packer(28).uint32(status).bytes
}

/**
 * Test the connection.
 *
 * @code 32
 * @return {Buffer}
 */
export function ping() {
    return new Packer(32).bytes
}

/**
 * Tell the server the files you want to share.
 *
 * @code 35
 * @param {number} folders
 * @param {number} files
 * @return {Buffer}
 */
export function setSharedFolders(folders, files) {
    return new Packer(35).uint32(folders).uint32(files).bytes
}

/**
 *  Search a specific user's shares.
 *
 * @code 42
 * @param {string} username
 * @param {number} ticket
 * @param query
 */
export function searchFromUser(username, ticket, query) {
    new Packer(42).str(username).uint32(ticket).str(query).bytes
}

/**
 * Add an item to your liked interests.
 *
 * @code 51
 * @param {string} item
 * @return {Buffer}
 */
export function like(item) {
    return new Packer(51).str(item).bytes
}

/**
 * Remove an item from liked interests.
 *
 * @code 52
 * @param {string} item
 * @return {Buffer}
 */
export function unlike(item) {
    return new Packer(52).str(item).bytes
}

/**
 * Request your list of recommendations.
 *
 * @code 54
 * @return {Buffer}
 */
export function getRecommendations() {
    return new Packer(54).bytes
}

/**
 * @code 56
 * @return {Buffer}
 */
export function getGlobalRecommendations() {
    return new Packer(56).bytes
}

/**
 * Get an user's liked and hated items.
 *
 * @code 57
 * @param {string} username
 * @return {Buffer}
 */
export function getUserLikes(username) {
    return new Packer(57).str(username).bytes
}

/**
 * Request the list of rooms.
 *
 * @code 64
 * @return {Buffer}
 */
export function getRooms() {
    return new Packer(64).bytes
}

/**
 * Request a list of privileged users.
 *
 * @code 69
 * @return {Buffer}
 */
export function getPrivilegedUsers() {
    return new Packer(69).bytes
}
