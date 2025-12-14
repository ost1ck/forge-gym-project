import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle, HelpCircle, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

// Функція для перевірки доступності місць на сервері
const checkAvailability = async ({ date, time }: { date: string, time: string }) => {
    // Використовуємо пустий рядок, щоб запит йшов на той самий домен
    const apiUrl = "";
    
    try {
        const response = await fetch(`${apiUrl}/check-availability`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date, time }),
        });

        if (!response.ok) {
            throw new Error("Server error during availability check");
        }

        return await response.json();
    } catch (error) {
        console.error("Error checking availability:", error);
        return { success: false, availableSlots: -1, error: "Помилка сервера." }; 
    }
};

const MAX_CAPACITY = 10; 

const Booking = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Стан для доступності місць
  const [availability, setAvailability] = useState({
      slots: null as number | null, 
      loading: false,       
      error: null as string | null,
      isAvailable: true,    
  });

  const LIMITS = {
    NAME: 30,
    PHONE: 12,
    EMAIL: 50,
    MESSAGE: 500
  };

  const now = useMemo(() => new Date(), []);
  const todayDateString = now.toISOString().split("T")[0]; 
  
  const today = todayDateString;
  const maxDateObj = new Date();
  maxDateObj.setMonth(maxDateObj.getMonth() + 3);
  const maxDate = maxDateObj.toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "", 
    goal: "general",
    date: todayDateString,
    time: "", 
    message: "" 
  });

  // Логіка для перевірки, чи минув час дня
  const isTimeOptionDisabled = (timeOption: string, selectedDate: string): boolean => {
    if (selectedDate !== todayDateString) {
        return false;
    }

    let endHour = 0;
    
    if (timeOption === "morning") { // Ранок (07:00 - 12:00)
        endHour = 12;
    } else if (timeOption === "day") { // День (12:00 - 17:00)
        endHour = 17;
    } else if (timeOption === "evening") { // Вечір (17:00 - 22:00)
        return now.getHours() >= 22; // Блокуємо тільки після 22:00
    } else {
        return true; 
    }

    // Блокуємо, якщо поточна година більше або дорівнює кінцевій годині періоду
    return now.getHours() >= endHour;
  };
  
  // Перевірка, чи минула дата
  const isPastDate = (selectedDate: string): boolean => {
    return selectedDate < todayDateString;
  };

  // ХУК ДЛЯ ПЕРЕВІРКИ ДОСТУПНОСТІ
  useEffect(() => {
    const { date, time } = formData;
    
    if (date && time && !isTimeOptionDisabled(time, date) && !isPastDate(date)) {
        setAvailability(prev => ({ ...prev, loading: true, error: null }));
        
        const check = async () => {
            const result = await checkAvailability({ date, time });
            
            if (result.success) {
                setAvailability({
                    slots: result.availableSlots,
                    loading: false,
                    error: null,
                    isAvailable: result.availableSlots > 0,
                });
            } else {
                setAvailability({
                    slots: -1, 
                    loading: false,
                    error: result.error || "Помилка перевірки місць на сервері.",
                    isAvailable: false,
                });
            }
        };
        const handler = setTimeout(check, 300);
        return () => clearTimeout(handler); 
    } else {
        setAvailability({ slots: null, loading: false, error: null, isAvailable: true });
    }
  }, [formData.date, formData.time]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numbersOnly = value.replace(/\D/g, "");
    if (numbersOnly.length <= LIMITS.PHONE) {
      setFormData({ ...formData, phone: numbersOnly });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Валідація
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) { toast({ variant: "destructive", title: "Некоректна пошта", description: "Введіть дійсну електронну адресу." }); return; }
    if (formData.phone.length < 10) { toast({ variant: "destructive", title: "Некоректний телефон", description: "Номер телефону занадто короткий." }); return; }
    if (!formData.date || !formData.time) { toast({ variant: "destructive", title: "Оберіть дату і час", description: "Будь ласка, вкажіть бажану дату і час тренування." }); return; }
    
    // КРИТИЧНА ПЕРЕВІРКА: Чи не минув час
    if (isPastDate(formData.date) || isTimeOptionDisabled(formData.time, formData.date)) {
        toast({ variant: "destructive", title: "Час минув", description: "Обраний час вже минув. Оберіть актуальний час." });
        return;
    }

    // 2. Блокуємо відправку, якщо місць немає
    if (!availability.isAvailable) {
        toast({ variant: "destructive", title: "Місця зайняті", description: "На жаль, на обраний час місця закінчилися. Оберіть інший час." });
        return;
    }

    setIsLoading(true);

    try {
      const apiUrl = ""; 

      const response = await fetch(`${apiUrl}/send-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Заявку прийнято! 🎉",
          description: `Дякуємо, ${formData.name}! Ми чекаємо вас ${formData.date}. Деталі надіслано на пошту.`,
        });
        
        // Очищаємо форму
        setFormData({
          name: "", phone: "", email: "", goal: "general", date: todayDateString, time: "", message: "" 
        });
      } else {
        // Обробка помилки 409 (Місця закінчилися) з сервера
        toast({
            variant: "destructive",
            title: "Місця закінчилися",
            description: result.message || "Не вдалося відправити заявку.",
        });
        throw new Error(result.error || result.message);
      }

    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Помилка сервера",
        description: "Не вдалося з'єднатися з сервером. Перевірте підключення.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Функція для відображення повідомлення про доступність
  const renderAvailabilityMessage = () => {
    if (!formData.date || !formData.time) { return null; }
    
    // Блокуємо повідомлення, якщо час минув
    if (isPastDate(formData.date) || isTimeOptionDisabled(formData.time, formData.date)) {
        return <p className="text-sm text-destructive font-medium mt-2">❌ Час минув. Оберіть інший час.</p>;
    }

    if (availability.loading) {
        return (
            <div className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" /> Перевіряємо вільні місця.
            </div>
        );
    }

    if (availability.error) {
        return <p className="text-sm text-destructive mt-2">{availability.error}</p>;
    }
    
    // Результати
    if (availability.slots !== null && availability.slots > 0) {
        return <p className="text-sm text-green-500 font-medium mt-2">✅ Вільних місць: {availability.slots} (з {MAX_CAPACITY})</p>;
    } else if (availability.slots === 0) {
        return <p className="text-sm text-destructive font-medium mt-2">❌ Місця закінчилися! Спробуйте інший час.</p>;
    }
    return null;
  };

  const CharacterCounter = ({ current, max }: { current: number, max: number }) => (
    <div className="text-right mt-1">
      <span className={`text-[10px] transition-colors duration-300 ${
        current >= max ? "text-destructive font-bold" : "text-muted-foreground"
      }`}>
        {current} / {max}
      </span>
    </div>
  );

  const faqItems = [
    { q: "Що потрібно взяти з собою?", a: "Лише зручну спортивну форму та кросівки. Рушник, воду та гель для душу ми надаємо безкоштовно." },
    { q: "Це справді безкоштовно?", a: "Так, перше тренування абсолютно безкоштовне і ні до чого вас не зобов'язує." },
    { q: "Чи буде тренер зі мною?", a: "Звісно! Черговий тренер проведе інструктаж, покаже, як користуватися тренажерами, та дасть базові рекомендації." }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <main className="flex-1 container-custom pt-28 pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <span className="text-primary font-semibold text-sm tracking-widest uppercase mb-4 block">Почніть свій шлях</span>
            <h1 className="heading-xl text-foreground mb-6">Запишіться на <span className="text-gradient">безкоштовне</span> пробне тренування</h1>
            <p className="text-body text-lg mb-8">Отримайте доступ до преміум обладнання, консультацію тренера та персональний план.</p>
            <div className="space-y-4">
              {["Безкоштовна діагностика тіла", "Доступ до всіх зон клубу", "Рушник та вода включені", "Знижка 15% на абонемент у день пробного"].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="text-primary h-5 w-5 flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* -------------------- ФОРМА БРОНЮВАННЯ (З ОСНОВНИМИ ПОЛЯМИ) -------------------- */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-card border border-border rounded-2xl p-8 shadow-card">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* ІМ'Я */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Ваше ім'я</label>
                <Input required placeholder="Олександр" maxLength={LIMITS.NAME} className="bg-secondary/50" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                <CharacterCounter current={formData.name.length} max={LIMITS.NAME} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ТЕЛЕФОН */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Телефон</label>
                  <Input required type="tel" placeholder="380..." className="bg-secondary/50" value={formData.phone} onChange={handlePhoneChange} />
                  <CharacterCounter current={formData.phone.length} max={LIMITS.PHONE} />
                </div>
                {/* EMAIL */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <Input required type="email" placeholder="alex@gmail.com" maxLength={LIMITS.EMAIL} className="bg-secondary/50" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  <CharacterCounter current={formData.email.length} max={LIMITS.EMAIL} />
                </div>
              </div>

              {/* ЦІЛЬ */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Основна ціль</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" value={formData.goal} onChange={(e) => setFormData({...formData, goal: e.target.value})}>
                  <option value="general">Підтримка форми</option>
                  <option value="weight_loss">Схуднення</option>
                  <option value="muscle">Набір маси</option>
                  <option value="rehab">Реабілітація</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. БАЖАНА ДАТА */}
                <div className="relative">
                  <label className="block text-sm font-medium text-foreground mb-2">Бажана дата</label>
                  <Input 
                    required 
                    type="date" 
                    min={today} 
                    max={maxDate} 
                    className="bg-secondary/50 block w-full pl-3 pr-3 text-left cursor-pointer" 
                    value={formData.date} 
                    onChange={(e) => setFormData({...formData, date: e.target.value})} 
                    onClick={(e) => (e.target as HTMLInputElement).showPicker()} 
                  />
                </div>
                
                {/* 2. ЧАС ДНЯ (з логікою блокування) */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Час дня</label>
                  <select 
                    required 
                    value={formData.time} 
                    onChange={(e) => setFormData({...formData, time: e.target.value})} 
                    className="flex h-10 w-full rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="" disabled>Оберіть час</option>
                    
                    {/* ОПЦІЇ ЧАСУ */}
                    <option value="morning" disabled={isTimeOptionDisabled("morning", formData.date)}>
                      Ранок (07:00 - 12:00)
                      {formData.date === todayDateString && isTimeOptionDisabled("morning", formData.date) && " (Минув)"}
                    </option>
                    
                    <option value="day" disabled={isTimeOptionDisabled("day", formData.date)}>
                      День (12:00 - 17:00)
                      {formData.date === todayDateString && isTimeOptionDisabled("day", formData.date) && " (Минув)"}
                    </option>
                    
                    <option value="evening" disabled={isTimeOptionDisabled("evening", formData.date)}>
                      Вечір (17:00 - 22:00)
                      {formData.date === todayDateString && isTimeOptionDisabled("evening", formData.date) && " (Минув)"}
                    </option>
                    
                  </select>
                </div>
              </div>
              
              {/* --- ТУТ Я ДОДАВ ВІДОБРАЖЕННЯ ВІЛЬНИХ МІСЦЬ --- */}
              {renderAvailabilityMessage()} 

              {/* КОМЕНТАР */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Коментар (необов'язково)</label>
                <textarea placeholder="Наприклад: хочу займатись з тренером Андрієм..." maxLength={LIMITS.MESSAGE} className="flex min-h-[80px] max-h-[300px] w-full rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} />
                <CharacterCounter current={formData.message.length} max={LIMITS.MESSAGE} />
              </div>

              {/* Кнопка блокується, якщо немає місць або час минув */}
              <Button 
                type="submit" 
                variant="hero" 
                size="lg" 
                className="w-full mt-2" 
                disabled={isLoading || !availability.isAvailable || isTimeOptionDisabled(formData.time, formData.date) || isPastDate(formData.date)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Відправляємо...
                  </>
                ) : (
                  "Забронювати час"
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-4">Натискаючи кнопку, ви погоджуєтесь з обробкою персональних даних.</p>
            </form>
          </motion.div>
          {/* ---------------------------------------------------------------------------- */}
        </div>
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-foreground flex items-center justify-center gap-2"><HelpCircle className="text-primary w-6 h-6" />Часті запитання</h3>
          </div>
          <div className="grid gap-4">
            {faqItems.map((faq, i) => (
              <div key={i} className="bg-card/50 border border-border p-4 rounded-xl">
                <h4 className="font-medium text-foreground mb-1">{faq.q}</h4>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Booking;