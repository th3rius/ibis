import { Socket } from 'net'
import { Packer } from '../message/packer'
import { Splitter } from '../message/splitter'
import { decoder } from '../server/decoder'

export class Peer {
  private constructor(private _socket: Socket) {
    this._socket.setNoDelay(true)
    this._socket.on('error', () => {
      return
    })
  }

  listen() {
    const splitter = new Splitter()
    return this._socket.pipe(splitter).pipe(decoder())
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

  sharesRequest() {
    this._socket.write(new Packer(4).bytes)
  }

  searchRequest(ticket: number, query: string) {
    this._socket.write(new Packer(8).uint32(ticket).str(query).bytes)
  }

  transferRequest(
    direction: 0 | 1,
    ticket: number,
    file: string,
    size?: number
  ) {
    const p = new Packer(40).uint32(direction).uint32(ticket).str(file)
    if (direction && size) p.uint64(size)
    this._socket.write(p.bytes)
  }
}
