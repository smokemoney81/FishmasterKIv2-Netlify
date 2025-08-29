import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/kibuddy", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // API Key in .env speichern
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // kleines schnelles Modell
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Fehler bei der KI-Anfrage" });
  }
});

export default router;