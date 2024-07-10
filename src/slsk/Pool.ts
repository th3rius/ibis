import net, {Socket} from "net";
import {Stream} from "stream";
import Packer from "./Packer";
import splitter from "./splitter";
import Unpacker from "./Unpacker";

export default class Pool {
  private sockets: Socket[] = [];
  readonly peerMessages = new Stream.PassThrough();

  connectToPeer(host: string, port: number, token: number) {
    const socket = net.connect({host, port}, () => {
      socket.write(new Packer(0, true).uint32(token).msg());
      socket.pipe(splitter()).on("data", async (buffer) => {
        const message = new Unpacker(buffer);

        if (message.code === 9) {
          await message.decompress();
          const username = message.str();
          const token = message.uint32();
          const resultsLength = message.uint32();
          const results = Array(resultsLength);
          for (let i = 0; i < resultsLength; i++) {
            message.uint8(); // code
            const filename = message.str();
            const size = message.uint64();
            const ext = message.str();
            const attributesLength = message.uint32();
            const attributes = Array(attributesLength);
            for (let i = 0; i < attributesLength; i++) {
              attributes[i] = {
                code: message.uint32(),
                value: message.uint32(),
              };
            }
            results[i] = {filename, size, ext, attributes};
          }
          const slotfree = message.bool();
          const avgspeed = message.uint32();
          const queueLength = message.uint32();
          message.uint32(); // unknown
          const response = {
            username,
            token,
            results,
            slotfree,
            avgspeed,
            queueLength,
          };
          this.peerMessages.emit("9", response);
        }
      });
      this.sockets.push(socket);
    });
    socket.on("error", () => {});
  }
}
