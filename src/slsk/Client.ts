import net from "net";
import splitter from "./splitter";
import Packer from "./Packer";
import Unpacker from "./Unpacker";
import {Stream} from "stream";
import token from "./token";
import Pool from "./Pool";

export default class Client {
  private serverMessages = new Stream.PassThrough();
  private server = net.connect({host: "server.slsknet.org", port: 2242});
  private pool = new Pool();

  constructor() {
    setInterval(() => {
      // console.log("ping...");
      this.server.write(new Packer(32).msg());
    }, 1000);

    this.server.pipe(splitter()).on("data", (buffer) => {
      const message = new Unpacker(buffer);
      let response;

      if (message.code === 1) {
        const success = message.bool();
        if (success) {
          const motd = message.str();
          response = {motd, success};
        } else {
          const reason = message.str();
          response = {reason, success};
        }

        this.serverMessages.emit("1", response);
      } else if (message.code === 32) {
        console.log("pong!");
      } else if (message.code === 18) {
        const username = message.str();
        const type = message.str();
        const ip = message.ip();
        const port = message.uint32();
        const token = message.uint32();
        const privileged = message.bool();
        message.uint32(); // unknown
        const obfuscatedPort = message.uint32();
        const response = {
          username,
          type,
          ip,
          port,
          token,
          privileged,
          obfuscatedPort,
        };
        this.pool.connectToPeer(response.ip, response.port, response.token);
      }
    });
  }

  login(username: string, password: string) {
    this.server.write(
      new Packer(1).str(username).str(password).uint32(182).msg()
    );
    return new Promise((resolve, reject) => {
      this.serverMessages.once("1", (response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(response);
        }
      });
    });
  }

  search(query: string, callback: any) {
    const searchToken = token();
    this.server.write(new Packer(26).uint32(searchToken).str(query).msg());
    this.pool.peerMessages.on("9", (response) => {
      if (response.token === searchToken) {
        callback(response);
      }
    });
  }

  destroy() {
    this.server.destroy();
  }
}
