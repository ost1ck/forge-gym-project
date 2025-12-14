const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// ================= НАЛАШТУВАННЯ =================
const telegramToken = "7934182685:AAGDYoLskY5NfAsIBGrTnxuirpKq0ZxYekc";
const adminChatId = "1779030022";
const myEmail = "kotula.ostap2003@gmail.com"; 
const myPassword = "ooiircjvmoqtbqxq"; 
const mongoUri = "mongodb+srv://kotulaostap2003_db_user:XRUbXh90lLouFhQ2@forgegym.tffppn7.mongodb.net/?appName=ForgeGym"; 

const MAX_CAPACITY = 10; 
const PORT = process.env.PORT || 5001;
// ===============================================

// --- ВАЖЛИВА ЗМІНА ---
// Виходимо на рівень вгору (..), щоб знайти папку dist
app.use(express.static(path.join(__dirname, '../dist')));
// ---------------------

// ПІДКЛЮЧЕННЯ ДО БД
mongoose.connect(mongoUri)
  .then(() => console.log("✅ База даних (MongoDB) підключена!"))
  .catch((err) => console.error("❌ Помилка підключення до БД:", err));

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

const bot = new TelegramBot(telegramToken, { polling: true }); 
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: myEmail, pass: myPassword },
});

// API ROUTES
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

app.post("/send-order", async (req, res) => {
  try {
    const { name, phone, email, goal, date, time, message } = req.body;
    
    const bookedCount = await Order.countDocuments({ date, time });
    if (bookedCount >= MAX_CAPACITY) {
        return res.status(409).json({ success: false, message: "На жаль, місця на цей час вже зайняті." });
    }
    
    const newOrder = new Order({ name, phone, email, goal, date, time, message });
    await newOrder.save();
    console.log(`💾 Збережено в MongoDB: ${name}`);

    const telegramText = `🔥 *НОВА ЗАЯВКА FORGE GYM* 🔥\n👤 ${name}\n📞 ${phone}\n📅 ${date} | ⏰ ${time}`;
    bot.sendMessage(adminChatId, telegramText, { parse_mode: "Markdown" }).catch(e => console.error("Telegram error:", e.message));

    if (email && email.includes('@')) { 
      const mailOptions = {
        from: `"Forge Gym" <${myEmail}>`,
        to: email,
        subject: "Ваш запис на тренування | Forge Gym",
        html: `<h1>Вітаємо, ${name}!</h1><p>Ви записані на ${date} о ${time}.</p>`
      };
      await transporter.sendMail(mailOptions);
    }

    res.status(200).json({ success: true, message: "Saved & Sent" });

  } catch (error) {
    console.error("Помилка:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});


app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Сервер запущено на порті ${PORT}`);
});