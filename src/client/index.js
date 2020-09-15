import * as net from 'net';
import serverMessages from './serverMessages';
import splitter from './splitter';
import serverDecoder from './serverDecoder';

class Index {
  connect(username, password) {
    this.username = username;
    this.host = 'server.slsknet.org';
    this.server = net.createConnection({ host: this.host, port: 2242 });
    this.server.pipe(splitter()).pipe(serverDecoder()).on('login', console.log);
    this.server.write(serverMessages.login(username, password));
  }
}

export default Index;
