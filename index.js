const express = require("express");
const app = express();

app.use(express.json());

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!token || !chatId) {
  throw new Error("Mangler TELEGRAM_BOT_TOKEN eller TELEGRAM_CHAT_ID");
}

async function sendTelegramMessage(text) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: text
    })
  });

  const data = await response.json();
  console.log("Telegram response:", data);
}

app.get("/", (req, res) => {
  res.send("Bot backend is live");
});

app.post("/webhook", async (req, res) => {
  console.log("Webhook received:", req.body);

  try {
    await sendTelegramMessage("Webhook modtaget");
    res.status(200).send("ok");
  } catch (error) {
    console.error("Telegram error:", error);
    res.status(500).send("telegram failed");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
