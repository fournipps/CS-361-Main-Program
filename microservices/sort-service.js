const zmq = require("zeromq");

async function startSortService() {
  const sock = new zmq.Reply();
  await sock.bind("tcp://127.0.0.1:5556");
  console.log("Sort service listening on tcp://127.0.0.1:5556");

  for await (const [msg] of sock) {
    try {
      const request = JSON.parse(msg.toString());
      const { items, sortOption } = request;

      if (!Array.isArray(items)) {
        throw new Error("`items` must be an array");
      }

      const sortedItems = [...items];

      switch (sortOption) {
        case "lowToHigh":
          sortedItems.sort((a, b) => a.price - b.price);
          break;

        case "highToLow":
          sortedItems.sort((a, b) => b.price - a.price);
          break;

        case "nameSort":
          sortedItems.sort((a, b) => a.name.localeCompare(b.name));
          break;

        case "artistSort":
          sortedItems.sort((a, b) => a.artist.localeCompare(b.artist));
          break;

        default:
          throw new Error("Invalid sort option");
      }

      await sock.send(JSON.stringify({ sortedItems }));
    } catch (err) {
      await sock.send(
        JSON.stringify({
          error: err.message || "Unknown error"
        })
      );
    }
  }
}

startSortService().catch(console.error);