import { Packer } from '../message/packer'
import { Socket } from 'net'
import { Splitter } from '../message/splitter'

export class Server {
  private _socket: Socket
  readonly version = 183

  constructor(port?: 2242 | 2472 | 4011) {
    this._socket = new Socket().connect({
      host: '208.76.170.59',
      port: port || 2474
    })
    this._socket.pipe(new Splitter().on('message', console.log))
  }

  login(username: string, password: string) {
    this._socket.write(
      new Packer(1).writeStr(username).writeStr(password).writeInt(this.version)
        .bytes
    )
  }
}
