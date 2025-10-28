import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());

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

app.listen(5000, () => console.log("✅ Proxy running on http://localhost:5000"));
