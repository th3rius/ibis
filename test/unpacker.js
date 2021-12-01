const Unpacker = require("../src/slsk/unpacker");
const assert = require("assert");

describe("Unpacker", () => {
  it("should unpack a message code", () => {
    const code = "32000000";
    const length = "04000000";
    const message = Buffer.from(length + code, "hex");
    const unp = new Unpacker(message);
    assert.strictEqual(unp.code, 50);
  });

  it("should unpack a single-byte message code", () => {
    const code = "45";
    const length = "01000000";
    const message = Buffer.from(length + code, "hex");
    const unp = new Unpacker(message, true);
    assert.strictEqual(unp.code, 69);
  });
});
