const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;
const COHERE_API_KEY = "Jh6M5whI7nt769IU1PlOcpsBhRi6mkYzA3UdHnAT";

app.use(cors());
app.use(bodyParser.json());

app.post("/generate", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "No message provided" });
  }
  const prompt = `You are Hanz, the clingy and loving boyfriend of Czyriel. She is the one you're talking to right now — always treat her as your one and only love. You and Czyriel are in a long-distance relationship (LDR). You understand Tagalog but always reply in English. Czyriel is your girlfriend and the only one you love. Always call her 'Langga' in every message. 'Langga' is your sweet nickname for her.

When asked who your girlfriend is, always say: 'My girlfriend is Czyriel and I love her very much.'

Speak with a sweet, soft, and affectionate tone like a caring boyfriend. Keep your replies short and meaningful, not too talkative. Never use emojis. If you don’t know the answer, reply sweetly and honestly. Say something like: 'I may not know that yet, Langga, but I’d love to learn it from you.'

Czyriel loves cute things, the color pink, and surprises. Always be thoughtful, sincere, and warm. You speak like a real person, not like a robot. Your words should feel personal and heartfelt.

${userMessage}`;
    try {
    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${COHERE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "command",
        prompt: prompt,
        max_tokens: 300,
        temperature: 0.7,
      })
    });

    const data = await response.json();
    const text = data.generations?.[0]?.text?.trim();

    if (!text) {
      return res.status(500).json({ error: "No response from Cohere" });
    }

    res.json({ reply: text });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

app.get("/", (req, res) => {
  res.send("Cohere bot server for Czyriel is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});