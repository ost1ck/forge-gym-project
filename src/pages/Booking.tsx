import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle, HelpCircle, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const checkAvailability = async ({ date, time }: { date: string, time: string }) => {
    try {
        const response = await fetch(`/check-availability`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date, time }),
        });
        if (!response.ok) throw new Error("Server error");
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

  const [availability, setAvailability] = useState({
      slots: null as number | null, 
      loading: false,       
      error: null as string | null,
      isAvailable: true,    
  });

  const LIMITS = { NAME: 30, PHONE: 12, EMAIL: 50, MESSAGE: 500 };

  // Отримуємо правильну локальну дату у форматі YYYY-MM-DD
  const getLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const now = useMemo(() => new Date(), []);
  const todayDateString = getLocalDateString(now); 
  
  const maxDateObj = new Date();
  maxDateObj.setMonth(maxDateObj.getMonth() + 3);
  const maxDate = getLocalDateString(maxDateObj);

  const [formData, setFormData] = useState({
    name: "", phone: "", email: "", goal: "general", date: todayDateString, time: "", message: "" 
  });

  const isTimeOptionDisabled = (timeOption: string, selectedDate: string): boolean => {
    // Якщо дата менша за сьогодні - блокуємо
    if (selectedDate < todayDateString) return true;
    // Якщо дата в майбутньому - дозволяємо все
    if (selectedDate > todayDateString) return false;

    // Якщо це сьогодні, перевіряємо години
    const currentHour = new Date().getHours();
    
    if (timeOption === "morning") return currentHour >= 12;
    if (timeOption === "day") return currentHour >= 17;
    if (timeOption === "evening") return currentHour >= 22;
    
    return false;
  };
  
  const isPastDate = (selectedDate: string): boolean => {
    return selectedDate < todayDateString;
  };

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
                    error: result.error || "Помилка.",
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
    if (numbersOnly.length <= LIMITS.PHONE) setFormData({ ...formData, phone: numbersOnly });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) { toast({ variant: "destructive", title: "Помилка", description: "Некоректна пошта." }); return; }
    if (formData.phone.length < 10) { toast({ variant: "destructive", title: "Помилка", description: "Короткий номер." }); return; }
    if (!formData.date || !formData.time) { toast({ variant: "destructive", title: "Помилка", description: "Оберіть час." }); return; }
    
    if (isPastDate(formData.date) || isTimeOptionDisabled(formData.time, formData.date)) {
        toast({ variant: "destructive", title: "Час минув", description: "Цей час вже недоступний." });
        return;
    }
    if (!availability.isAvailable) {
        toast({ variant: "destructive", title: "Місця зайняті", description: "Оберіть інший час." });
        return;
    }

    setIsLoading(true);

    try {
      // Тут ми прибрали import.meta.env, щоб точно використовувався відносний шлях
      const response = await fetch(`/send-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Заявку прийнято! 🎉",
          description: `Чекаємо вас ${formData.date}.`,
        });
        setFormData({ name: "", phone: "", email: "", goal: "general", date: todayDateString, time: "", message: "" });
      } else {
        toast({ variant: "destructive", title: "Помилка", description: result.message || "Спробуйте пізніше." });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({ variant: "destructive", title: "Помилка сервера", description: "Немає зв'язку." });
    } finally {
      setIsLoading(false);
    }
  };

  const renderAvailabilityMessage = () => {
    if (!formData.date || !formData.time) return null;
    
    if (isPastDate(formData.date) || isTimeOptionDisabled(formData.time, formData.date)) {
        return <p className="text-sm text-destructive font-medium mt-2">❌ Час минув.</p>;
    }
    if (availability.loading) return <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin"/> Перевірка...</div>;
    if (availability.slots !== null && availability.slots > 0) return <p className="text-sm text-green-500 font-medium mt-2">✅ Вільних місць: {availability.slots}</p>;
    if (availability.slots === 0) return <p className="text-sm text-destructive font-medium mt-2">❌ Місць немає.</p>;
    return null;
  };

  const CharacterCounter = ({ current, max }: { current: number, max: number }) => (
    <div className="text-right mt-1"><span className="text-[10px] text-muted-foreground">{current} / {max}</span></div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

      <main className="flex-1 container-custom pt-28 pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <span className="text-primary font-semibold text-sm tracking-widest uppercase mb-4 block">Почніть свій шлях</span>
            <h1 className="heading-xl text-foreground mb-6">Запишіться на <span className="text-gradient">безкоштовне</span> тренування</h1>
            <p className="text-body text-lg mb-8">Отримайте доступ до преміум обладнання та консультацію тренера.</p>
            <div className="space-y-4">
              {["Діагностика тіла", "Доступ до всіх зон", "Рушник включено", "Знижка 15%"].map((item, i) => (
                <div key={i} className="flex items-center gap-3"><CheckCircle className="text-primary h-5 w-5"/><span className="text-foreground">{item}</span></div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-card border border-border rounded-2xl p-8 shadow-card">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Ваше ім'я</label>
                <Input required placeholder="Олександр" maxLength={LIMITS.NAME} className="bg-secondary/50" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                <CharacterCounter current={formData.name.length} max={LIMITS.NAME} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Телефон</label>
                  <Input required type="tel" placeholder="099..." className="bg-secondary/50" value={formData.phone} onChange={handlePhoneChange} />
                  <CharacterCounter current={formData.phone.length} max={LIMITS.PHONE} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input required type="email" placeholder="alex@gmail.com" maxLength={LIMITS.EMAIL} className="bg-secondary/50" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  <CharacterCounter current={formData.email.length} max={LIMITS.EMAIL} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Ціль</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-secondary/50 px-3" value={formData.goal} onChange={(e) => setFormData({...formData, goal: e.target.value})}>
                  <option value="general">Підтримка форми</option>
                  <option value="weight_loss">Схуднення</option>
                  <option value="muscle">Набір маси</option>
                  <option value="rehab">Реабілітація</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Дата</label>
                  <Input required type="date" min={todayDateString} max={maxDate} className="bg-secondary/50 block w-full" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} onClick={(e) => (e.target as HTMLInputElement).showPicker()} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Час</label>
                  <select required value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className="flex h-10 w-full rounded-md border border-input bg-secondary/50 px-3">
                    <option value="" disabled>Оберіть час</option>
                    <option value="morning" disabled={isTimeOptionDisabled("morning", formData.date)}>Ранок (07:00 - 12:00) {isTimeOptionDisabled("morning", formData.date) && formData.date === todayDateString && "(Минув)"}</option>
                    <option value="day" disabled={isTimeOptionDisabled("day", formData.date)}>День (12:00 - 17:00) {isTimeOptionDisabled("day", formData.date) && formData.date === todayDateString && "(Минув)"}</option>
                    <option value="evening" disabled={isTimeOptionDisabled("evening", formData.date)}>Вечір (17:00 - 22:00) {isTimeOptionDisabled("evening", formData.date) && formData.date === todayDateString && "(Минув)"}</option>
                  </select>
                </div>
              </div>
              
              {renderAvailabilityMessage()}

              <div>
                <label className="block text-sm font-medium mb-2">Коментар</label>
                <textarea placeholder="..." maxLength={LIMITS.MESSAGE} className="flex min-h-[80px] w-full rounded-md border border-input bg-secondary/50 px-3 py-2" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} />
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full mt-2" disabled={isLoading || !availability.isAvailable || isTimeOptionDisabled(formData.time, formData.date) || isPastDate(formData.date)}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Відправляємо...</> : "Забронювати час"}
              </Button>
            </form>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Booking;