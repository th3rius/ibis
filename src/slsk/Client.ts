import net from "net";
import splitter from "./splitter";
import Packer from "./Packer";

export default class Client {
  private server = net
    .connect({host: "server.slsknet.org", port: 2242})
    .pipe(splitter());

  constructor() {
    console.log("connceted");
    this.server.write(
      new Packer(1).str("username").str("password").uint32(182).msg()
    );
    this.server.on("data", console.log);
  }

  destroy() {
    this.server.destroy();
  }
}
