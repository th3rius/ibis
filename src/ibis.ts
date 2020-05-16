import { Server } from './server/server'
import { Peer } from './peer/peer'

const s = Server.connect()
s.login('username', 'password')
s.listen().on('peer', message => {
  // console.log(message)
  const p = Peer.connect(message.ip, message.port)
  p.pierceFirewall(message.token)
})
s.search(0, 'coldplay')
