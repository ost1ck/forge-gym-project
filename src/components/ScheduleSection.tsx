import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { scheduleData, ScheduleItem } from "@/data/schedule-data"; 
import { checkAvailability } from "@/api/api"; 

const daysOfWeek = ["Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота", "Неділя"];

const ScheduleSection = () => {
  // Стан для динамічних вільних місць
  const [slots, setSlots] = useState<{ [key: string]: number }>({});
  const [loadingSlots, setLoadingSlots] = useState(true);

  const today = new Date().toISOString().split("T")[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = tomorrowDate.toISOString().split("T")[0];

  const periods = ["morning", "day", "evening"] as const;

  // Функція для fetch вільних місць
  useEffect(() => {
    const fetchSlots = async () => {
      const results: { [key: string]: number } = {};
      for (const date of [today, tomorrow]) {
        for (const period of periods) {
          const res = await checkAvailability({ date, time: period });
          if (res.success) {
            results[`${date}-${period}`] = res.availableSlots;
          } else {
            results[`${date}-${period}`] = 0; 
          }
        }
      }
      setSlots(results);
      setLoadingSlots(false);
    };

    fetchSlots();
    // Polling: оновлюємо кожні 60 секунд для реал-тайму
    const interval = setInterval(fetchSlots, 60000);
    return () => clearInterval(interval);
  }, []);

  // Групування статичного розкладу по днях
  const groupedSchedule: { [key: number]: ScheduleItem[] } = {};
  scheduleData.forEach(item => {
    if (!groupedSchedule[item.dayOfWeek]) {
      groupedSchedule[item.dayOfWeek] = [];
    }
    groupedSchedule[item.dayOfWeek].push(item);
  });

  return (
    <section className="py-16 bg-background">
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-2">
            <CalendarIcon className="text-primary w-8 h-8" />
            Розклад тренувань
          </h2>
          
          {/* Статичний розклад групових тренувань */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {daysOfWeek.map((day, index) => {
              const dayIndex = index + 1;
              const items = groupedSchedule[dayIndex] || [];
              return (
                <div key={day} className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">{day}</h3>
                  {items.length > 0 ? (
                    <ul className="space-y-4">
                      {items.map(item => (
                        <li key={item.id} className="flex flex-col">
                          <span className="font-medium">{item.time} - {item.title}</span>
                          <span className="text-sm text-muted-foreground">Тренер: {item.trainer}</span>
                          <span className="text-sm text-muted-foreground">Макс. місць: {item.maxCapacity}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">Немає тренувань</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Динамічний блок вільних місць на пробне */}
          <div className="mt-12 p-6 bg-card rounded-xl border border-border">
            <h3 className="text-2xl font-semibold text-foreground mb-6">Вільні місця на пробне тренування</h3>
            {loadingSlots ? (
              <div className="flex justify-center items-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Завантаження...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="font-medium text-lg mb-4">Сьогодні ({today})</p>
                  <div className="space-y-2">
                    {periods.map(p => (
                      <div key={p} className="flex justify-between">
                        <span className="capitalize">{p === "morning" ? "Ранок" : p === "day" ? "День" : "Вечір"}</span>
                        <span className={slots[`${today}-${p}`] > 0 ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                          {slots[`${today}-${p}`] ?? "?"} вільно (з 10)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-medium text-lg mb-4">Завтра ({tomorrow})</p>
                  <div className="space-y-2">
                    {periods.map(p => (
                      <div key={p} className="flex justify-between">
                        <span className="capitalize">{p === "morning" ? "Ранок" : p === "day" ? "День" : "Вечір"}</span>
                        <span className={slots[`${tomorrow}-${p}`] > 0 ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                          {slots[`${tomorrow}-${p}`] ?? "?"} вільно (з 10)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ScheduleSection;