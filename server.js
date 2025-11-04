import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());



app.get("/api/dashboard", async (req, res) => {
  try {
    const response = await fetch("https://slhlab.pythonanywhere.com/api/pzem/latest/NODE_1/");
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    res.status(500).send("Error fetching data");
  }
});


app.get("/api/relayStatus", async (req, res) => {
  try {
    const response = await fetch("https://slhlab.pythonanywhere.com/api/pzem/control/NODE_1/", {
      headers: { "x-api-key": "Chutiya@123" },
    });
    const data = await response.json();
    res.json({ relay: data.relay, updated: data.updated });
  } catch (error) {
    console.error("Error fetching relay:", error);
    res.status(500).send("Error fetching relay status");
  }
});

app.post("/proxy/control", async (req, res) => {
  try {
        const response = await fetch("https://slhlab.pythonanywhere.com/api/pzem/control/NODE_1/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": "Chutiya@123",
        },
        body: JSON.stringify(req.body),
      });
    const raw = await response.text();
    console.log("Raw response:", raw);
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      data = { raw }; // in case response is not valid JSON
    }
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Proxy failed" });
  }
});


app.listen(5000, () => console.log("✅ Proxy running on https://pzem.onrender.com"));
