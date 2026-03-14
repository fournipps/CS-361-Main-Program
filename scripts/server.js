const express = require("express");
const cors = require("cors");
const zmq = require("zeromq");

const app = express();

app.use(cors());
app.use(express.json());

// FILTER endpoint
app.post("/api/filter-albums", async (req, res) => {
  const { items, genre } = req.body;
  const sock = new zmq.Request();

  try {
    await sock.connect("tcp://127.0.0.1:5555");

    const payload = {
      items,
      filter: {
        field: "genre",
        value: genre
      }
    };

    await sock.send(JSON.stringify(payload));

    const [result] = await sock.receive();
    const parsed = JSON.parse(result.toString());

    if (parsed.error) {
      return res.status(400).json({ error: parsed.error });
    }

    res.json(parsed);
  } catch (error) {
    console.error("Filter route error:", error);
    res.status(500).json({ error: error.message });
  } finally {
    sock.close();
  }
});

// SORT endpoint
app.post("/api/sort-albums", async (req, res) => {
  const { items, sortOption } = req.body;
  const sock = new zmq.Request();

  try {
    await sock.connect("tcp://127.0.0.1:5556");

    const payload = {
      items,
      sortOption
    };

    await sock.send(JSON.stringify(payload));

    const [result] = await sock.receive();
    const parsed = JSON.parse(result.toString());

    if (parsed.error) {
      return res.status(400).json({ error: parsed.error });
    }

    res.json(parsed);
  } catch (error) {
    console.error("Sort route error:", error);
    res.status(500).json({ error: error.message });
  } finally {
    sock.close();
  }
});

// SEARCH endpoint
app.post("/api/search-albums", async (req, res) => {
  const { items, searchTerm } = req.body;
  const sock = new zmq.Request();

  try {
    await sock.connect("tcp://127.0.0.1:5557");

    const payload = {
      items,
      searchTerm
    };

    await sock.send(JSON.stringify(payload));

    const [result] = await sock.receive();
    const parsed = JSON.parse(result.toString());

    if (parsed.error) {
      return res.status(400).json({ error: parsed.error });
    }

    res.json(parsed);
  } catch (error) {
    console.error("Search route error:", error);
    res.status(500).json({ error: error.message });
  } finally {
    sock.close();
  }
});

// CART TOTAL endpoint
app.post("/api/cart-total", async (req, res) => {
  const { items } = req.body;
  const sock = new zmq.Request();

  try {
    await sock.connect("tcp://127.0.0.1:5558");

    await sock.send(JSON.stringify({ items }));

    const [result] = await sock.receive();
    const parsed = JSON.parse(result.toString());

    if (parsed.error) {
      return res.status(400).json({ error: parsed.error });
    }

    res.json(parsed);
  } catch (error) {
    console.error("Cart total route error:", error);
    res.status(500).json({ error: error.message });
  } finally {
    sock.close();
  }
});

app.listen(3000, () => {
  console.log("Backend server running on http://localhost:3000");
});