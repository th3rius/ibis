import { Socket } from 'net'
import { Packer } from '../message/packer'

export class Peer {
  private constructor(private _socket: Socket) {
    this._socket.setNoDelay(true)
    this._socket.setTimeout(3000, this._socket.destroy)
    this._socket.on('data', console.log)
  }

  static connect(host: string, port: number) {
    return new this(new Socket().connect({ host, port }))
  }

  static accept(socket: Socket) {
    return new this(socket)
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
