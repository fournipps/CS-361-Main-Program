const zmq = require("zeromq");

async function startCartService() {
  const sock = new zmq.Reply();
  await sock.bind("tcp://127.0.0.1:5558");
  console.log("Cart total service listening on tcp://127.0.0.1:5558");

  for await (const [msg] of sock) {
    try {
      const request = JSON.parse(msg.toString());
      const { items } = request;

      if (!Array.isArray(items)) {
        throw new Error("`items` must be an array");
      }

      const totalPrice = items.reduce((sum, item) => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 0;
        return sum + price * quantity;
      }, 0);

      await sock.send(JSON.stringify({ totalPrice }));
    } catch (err) {
      await sock.send(
        JSON.stringify({
          error: err.message || "Unknown error"
        })
      );
    }
  }
}

startCartService().catch(console.error);