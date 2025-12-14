// src/data/schedule-data.ts

export interface ScheduleItem {
    id: number;
    time: string; // Час тренування (наприклад, "07:00")
    title: string; // Назва тренування
    trainer: string; // Тренер
    maxCapacity: number; // Максимальна кількість учасників
    dayOfWeek: number; // 1=ПН, 2=ВТ, ..., 7=НД
    timeCategory: 'morning' | 'day' | 'evening'; // Категорія для бронювання
}

const getTimeCategory = (hour: number): ScheduleItem['timeCategory'] => {
    if (hour >= 7 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'day';
    if (hour >= 17 && hour <= 22) return 'evening';
    return 'morning';
};

export const scheduleData: ScheduleItem[] = [
    // ПОНЕДІЛОК (dayOfWeek: 1)
    { id: 101, time: "07:00", title: "Ранкова йога", trainer: "Анна М.", maxCapacity: 8, dayOfWeek: 1, timeCategory: getTimeCategory(7) },
    // ВІВТОРОК (dayOfWeek: 2)
    { id: 201, time: "08:00", title: "HIIT (Інтенсив)", trainer: "Максим П.", maxCapacity: 15, dayOfWeek: 2, timeCategory: getTimeCategory(8) },
    // СЕРЕДА (dayOfWeek: 3)
    { id: 301, time: "18:00", title: "CrossFit WOD", trainer: "Максим П.", maxCapacity: 15, dayOfWeek: 3, timeCategory: getTimeCategory(18) },
    // ЧЕТВЕР (dayOfWeek: 4)
    { id: 401, time: "19:00", title: "Бокс", trainer: "Максим П.", maxCapacity: 8, dayOfWeek: 4, timeCategory: getTimeCategory(19) },
    // П'ЯТНИЦЯ (dayOfWeek: 5)
    { id: 501, time: "10:00", title: "Пілатес", trainer: "Анна М.", maxCapacity: 12, dayOfWeek: 5, timeCategory: getTimeCategory(10) },
    { id: 502, time: "17:00", title: "Силове тренування", trainer: "Олександр К.", maxCapacity: 10, dayOfWeek: 5, timeCategory: getTimeCategory(17) },
    // СУБОТА (dayOfWeek: 6)
    { id: 601, time: "11:00", title: "Йога вихідного дня", trainer: "Анна М.", maxCapacity: 15, dayOfWeek: 6, timeCategory: getTimeCategory(11) },
    // НЕДІЛЯ (dayOfWeek: 7)
    { id: 701, time: "12:00", title: "Відновлюючий Stretching", trainer: "Анна М.", maxCapacity: 10, dayOfWeek: 7, timeCategory: getTimeCategory(12) },
];