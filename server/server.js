import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import process from "node:process";

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post("/api/send", async (req, res) => {
  const { phone, contact, message } = req.body;

  if (!phone || !contact || !message) {
    return res.status(400).json({
      success: false,
      message: "Заполните все поля",
    });
  }

  const text = `
🔔 НОВАЯ ЗАЯВКА

📞 Телефон:
${phone}

📨 Telegram / E-mail:
${contact}

💬 Запрос:
${message}
  `;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: process.env.CHAT_ID,
          text,
        }),
      }
    );

    const data = await response.json();

    if (!data.ok) {
      console.error(data);

      return res.status(500).json({
        success: false,
        message: "Не удалось отправить заявку",
      });
    }

    res.json({
      success: true,
      message: "Заявка успешно отправлена",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Ошибка сервера",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server started: http://localhost:${PORT}`);
});