import { Socket } from 'net'
import { Packer } from '../message/packer'
import { splitter } from '../message/splitter'

export class Peer {
  private constructor(private _socket: Socket) {
    this._socket.setNoDelay(true)
  }

  static connect(host: string, port: number) {
    return new this(new Socket().connect({ host, port }))
  }

  static accept(socket: Socket) {
    return new this(socket)
  }

  listen() {
    return this._socket.pipe(splitter())
  }

  pierceFirewall(token: number) {
    this._socket.write(new Packer(0, true).uint32(token).bytes)
  }

  peerInit(username: string, type: 'P' | 'F', token: number) {
    this._socket.write(
      new Packer(1).str(username).str(type).uint32(token).bytes
    )
  }
}
