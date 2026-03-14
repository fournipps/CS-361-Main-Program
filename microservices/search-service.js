const zmq = require("zeromq");

async function startSearchService() {
  const sock = new zmq.Reply();
  await sock.bind("tcp://127.0.0.1:5557");
  console.log("Search service listening on tcp://127.0.0.1:5557");

  for await (const [msg] of sock) {
    try {
      const request = JSON.parse(msg.toString());
      const { items, searchTerm } = request;

      if (!Array.isArray(items)) {
        throw new Error("`items` must be an array");
      }

      if (typeof searchTerm !== "string") {
        throw new Error("`searchTerm` must be a string");
      }

      const normalizedTerm = searchTerm.trim().toLowerCase();

      const searchedItems = items.filter((item) => {
        const albumName = item.name.toLowerCase();
        const artistName = item.artist.toLowerCase();

        return (
          albumName.includes(normalizedTerm) ||
          artistName.includes(normalizedTerm)
        );
      });

      await sock.send(JSON.stringify({ searchedItems }));
    } catch (err) {
      await sock.send(
        JSON.stringify({
          error: err.message || "Unknown error"
        })
      );
    }
  }
}

startSearchService().catch(console.error);