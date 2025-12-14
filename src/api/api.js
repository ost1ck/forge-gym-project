// src/api/api.js

const API_URL = "http://localhost:5001";

// НОВА ФУНКЦІЯ: Перевіряє доступність місць
export const checkAvailability = async ({ date, time }) => {
  try {
    const response = await fetch(`${API_URL}/check-availability`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date, time }),
    });

    if (!response.ok) {
      // Якщо сервер повернув помилку
      throw new Error("Failed to check availability");
    }

    return await response.json();
  } catch (error) {
    console.error("Error checking availability:", error);
    // Повертаємо помилковий стан, щоб уникнути блокування форми
    return { success: false, availableSlots: -1 }; 
  }
};


// ІСНУЮЧА ФУНКЦІЯ: Відправка замовлення
export const sendOrder = async (orderData) => {
  // ... (Твій код функції sendOrder залишається без змін)
  try {
    const response = await fetch(`${API_URL}/send-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (response.status === 409) {
         // Обробка конфлікту місць, якщо сервер відхилить заявку
        const errorData = await response.json();
        return { success: false, message: errorData.message || "Місця вже зайняті." };
    }
    
    if (!response.ok) {
      throw new Error("Failed to send order");
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending order:", error);
    return { success: false, message: "Помилка сервера. Спробуйте пізніше." };
  }
};