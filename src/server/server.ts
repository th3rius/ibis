import { Packer } from '../message/packer'
import { Socket } from 'net'
import { splitter } from '../message/splitter'
import { decoder } from './decoder'

export class Server {
  static readonly ip = '208.76.170.59'
  static readonly port = 2474
  readonly version = 183

  private constructor(private _socket: Socket) {
    this._socket.setNoDelay(true)
  }

  static connect() {
    return new this(new Socket().connect({ host: this.ip, port: this.port }))
  }

  listen() {
    return this._socket.pipe(splitter()).pipe(decoder)
  }

  login(username: string, password: string) {
    this._socket.write(
      new Packer(1).str(username).str(password).uint32(this.version).bytes
    )
  }

  setListenPort(port: number) {
    this._socket.write(new Packer(2).uint32(port).bytes)
  }

  getPeerAddr(username: string) {
    this._socket.write(new Packer(3).str(username).bytes)
  }

  watchUser(username: string) {
    this._socket.write(new Packer(5).str(username).bytes)
  }

  getStatus(username: string) {
    this._socket.write(new Packer(7).str(username).bytes)
  }

  sendRoomMsg(room: string, message: string) {
    this._socket.write(new Packer(13).str(room).str(message).bytes)
  }

  joinRoom(room: string) {
    this._socket.write(new Packer(14).str(room).bytes)
  }

  leaveRoom(room: string) {
    this._socket.write(new Packer(15).str(room).bytes)
  }

  connectToPeer(token: number, username: string, type: 'P' | 'F') {
    this._socket.write(
      new Packer(18).uint32(token).str(username).str(type).bytes
    )
  }

  sendPrivateMsg(username: string, message: string) {
    this._socket.write(new Packer(22).str(username).str(message).bytes)
  }

  ackMsg(id: number) {
    this._socket.write(new Packer(23).uint32(id).bytes)
  }

  search(ticket: number, query: string) {
    this._socket.write(new Packer(26).uint32(ticket).str(query).bytes)
  }

  setStatus(status: 0 | 1 | 2) {
    this._socket.write(new Packer(28).uint32(status).bytes)
  }

  ping() {
    this._socket.write(new Packer(32).bytes)
  }

  setSharedFolders(folders: number, files: number) {
    this._socket.write(new Packer(35).uint32(folders).uint32(files).bytes)
  }

  /** @deprecated */
  getUserStatus(username: string) {
    this._socket.write(new Packer(36).str(username).bytes)
  }

  searchFromUser(username: string, ticket: number, query: string) {
    this._socket.write(
      new Packer(42).str(username).uint32(ticket).str(query).bytes
    )
  }

  like(item: string) {
    this._socket.write(new Packer(51).str(item).bytes)
  }

  unlike(item: string) {
    this._socket.write(new Packer(52).str(item).bytes)
  }

  getRecommendations() {
    this._socket.write(new Packer(54).bytes)
  }

  getGlobalReccomendations() {
    this._socket.write(new Packer(56).bytes)
  }

  getUserLikes(username: string) {
    this._socket.write(new Packer(57).str(username).bytes)
  }

  getRooms() {
    this._socket.write(new Packer(64).bytes)
  }
}
