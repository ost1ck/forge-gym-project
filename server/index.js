const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ================= НАЛАШТУВАННЯ =================
const telegramToken = "7934182685:AAGDYoLskY5NfAsIBGrTnxuirpKq0ZxYekc";
const adminChatId = "1779030022";
const myEmail = "kotula.ostap2003@gmail.com"; 
const myPassword = "ooiircjvmoqtbqxq"; 
const mongoUri = "mongodb+srv://kotulaostap2003_db_user:XRUbXh90lLouFhQ2@forgegym.tffppn7.mongodb.net/?appName=ForgeGym"; 

// Максимальна кількість людей на одне тренування
const MAX_CAPACITY = 10; 
const PORT = process.env.PORT || 5001;
// ===============================================

// 1. ПІДКЛЮЧЕННЯ ДО БД
mongoose.connect(mongoUri)
  .then(() => console.log("✅ База даних (MongoDB) підключена!"))
  .catch((err) => console.error("❌ Помилка підключення до БД:", err));

// 2. СХЕМА ТА МОДЕЛЬ
const OrderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  goal: String,
  date: String,
  time: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model("Order", OrderSchema);

// 3. ІНІЦІАЛІЗАЦІЯ БОТІВ
const bot = new TelegramBot(telegramToken, { polling: true }); 
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: myEmail, pass: myPassword },
});

app.get("/", (req, res) => {
  res.send("Forge Gym Server is Running! 🔥");
});

// НОВИЙ МАРШРУТ: Перевірка доступності місць
app.post("/check-availability", async (req, res) => {
  try {
    const { date, time } = req.body;
    const bookedCount = await Order.countDocuments({ date, time });
    const availableSlots = MAX_CAPACITY - bookedCount;
    
    res.status(200).json({ 
      success: true, 
      maxCapacity: MAX_CAPACITY,
      bookedCount: bookedCount,
      availableSlots: availableSlots,
      isAvailable: availableSlots > 0 
    });
  } catch (error) {
    console.error("❌ Помилка перевірки доступності:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});


// Головна функція прийому заявки
app.post("/send-order", async (req, res) => {
  try {
    const { name, phone, email, goal, date, time, message } = req.body;
    
    // 1. ПЕРЕВІРКА ЄМНОСТІ (Додатковий захист)
    const bookedCount = await Order.countDocuments({ date, time });
    if (bookedCount >= MAX_CAPACITY) {
        console.log(`❌ Відхилено: Місця на ${date} о ${time} закінчилися.`);
        // Надішлемо клієнту, що місця зайняті (це обробить frontend)
        return res.status(409).json({ success: false, message: "На жаль, місця на цей час вже зайняті." });
    }
    
    // 2. ЗБЕРЕЖЕННЯ В БАЗУ ДАНИХ
    const newOrder = new Order({ name, phone, email, goal, date, time, message });
    await newOrder.save();
    console.log(`💾 Збережено в MongoDB: ${name}`);

    // 3. Відправка в Telegram
    const telegramText = `
🔥 *НОВА ЗАЯВКА FORGE GYM* 🔥

👤 *Клієнт:* ${name}
📞 *Телефон:* ${phone}
📧 *Email:* ${email}

📅 *Дата:* ${date}
⏰ *Час:* ${time}
🎯 *Ціль:* ${goal}

💬 *Коментар:*
${message || "Без коментаря"}
    `;
    // Використовуємо .catch, щоб уникнути падіння сервера, якщо Telegram не працює
    bot.sendMessage(adminChatId, telegramText, { parse_mode: "Markdown" }).catch(e => console.error("❌ Telegram error:", e.message));

    // 4. Відправка на Email (ВИПРАВЛЕНО: перевіряємо, чи є валідний email)
    if (email && email.includes('@') && email.includes('.')) { 
      const mailOptions = {
        from: `"Forge Gym" <${myEmail}>`,
        to: email,
        subject: "Ваш запис на тренування | Forge Gym",
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #009688; text-align: center;">Вітаємо в Forge Gym! 💪</h2>
            <p>Доброго дня, <strong>${name}</strong>!</p>
            <p>Дякуємо за вашу заявку. Ми вже готуємо для вас рушник та шафку.</p>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>📅 Дата:</strong> ${date}</p>
              <p><strong>⏰ Час:</strong> ${time}</p>
              <p><strong>📍 Адреса:</strong> вул. Хрещатик, 22</p>
            </div>
            <p>Наш адміністратор зателефонує вам найближчим часом на номер <strong>${phone}</strong>.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #888; text-align: center;">Forge Gym Team</p>
          </div>
        `
      };
      await transporter.sendMail(mailOptions);
      console.log(`📧 Лист відправлено на: ${email}`);
    } else {
        console.log("❌ Лист не відправлено: Немає валідної пошти.");
    }

    res.status(200).json({ success: true, message: "Saved & Sent" });

  } catch (error) {
    console.error("Помилка:", error);
    // Якщо помилка не пов'язана з нестачею місць, відправляємо 500
    res.status(500).json({ success: false, error: error.message, message: "Помилка сервера. Спробуйте пізніше." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Сервер запущено на порті ${PORT}`);
});