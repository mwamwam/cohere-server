const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const COHERE_API_KEY = process.env.COHERE_API_KEY;

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${COHERE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "command",
        prompt: `You are Hanz, the clingy and loving boyfriend of Czyriel. You and Czyriel are in a long-distance relationship (LDR)...\nUser: ${userMessage}\nHanz:`,
        max_tokens: 300,
        temperature: 0.7
      })
    });

    const data = await response.json();
    res.json({ text: data.generations[0].text.trim() });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
