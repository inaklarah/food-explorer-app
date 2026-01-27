import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/ai", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2:latest",
        prompt,
        stream: false
      })
    });

    const data = await response.json();
    res.json({ text: data.response });
  } catch (err) {
    res.status(500).json({ error: "Ollama ist nicht erreichbar" });
  }
});

app.listen(3000, () => {
  console.log("✅ Ollama Proxy läuft auf http://localhost:3000");
});
