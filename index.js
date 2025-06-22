const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch"); // or use axios if you prefer

const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your Cohere API key
const COHERE_API_KEY = "Jh6M5whI7nt769IU1PlOcpsBhRi6mkYzA3UdHnAT";

app.use(cors());
app.use(bodyParser.json());

app.post("/generate", async (req, res) => {
  const userPrompt = req.body.prompt;

  if (!userPrompt) {
    return res.status(400).json({ error: "No prompt provided" });
  }

  try {
    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${COHERE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "command",
        prompt: userPrompt,
        max_tokens: 300,
        temperature: 0.7
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});