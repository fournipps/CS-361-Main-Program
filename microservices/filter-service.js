const zmq = require("zeromq");

async function startFilterService() {
  // REP socket
  const sock = new zmq.Reply();         
  await sock.bind("tcp://127.0.0.1:5555");
  console.log("Filter service listening on tcp://127.0.0.1:5555");

  for await (const [msg] of sock) {
    try {
      const request = JSON.parse(msg.toString());
      const { items, filter } = request;
      const { field, value } = filter;

      if (!Array.isArray(items)) {
        throw new Error("`items` must be an array");
      }

      const filteredItems = items.filter((item) => item[field] === value);

      const response = { filteredItems };
      await sock.send(JSON.stringify(response));
    } catch (err) {
      // Send an error response if something goes wrong
      await sock.send(JSON.stringify({
        error: err.message || "Unknown error"
      }));
    }
  }
}

startFilterService().catch(console.error);