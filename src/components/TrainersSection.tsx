import { motion } from "framer-motion";
import { Instagram, Award } from "lucide-react";
import trainer1 from "@/assets/trainer-1.jpg";
import trainer2 from "@/assets/trainer-2.jpg";
import trainer3 from "@/assets/trainer-3.jpg";

const trainers = [
  {
    name: "Олександр Коваль",
    role: "Силовий Тренінг",
    image: trainer1,
    experience: "12 років",
    achievements: "Майстер спорту",
  },
  {
    name: "Анна Мельник",
    role: "Фітнес та Йога",
    image: trainer2,
    experience: "8 років",
    achievements: "Сертифікований інструктор",
  },
  {
    name: "Максим Петренко",
    role: "Кросфіт та HIIT",
    image: trainer3,
    experience: "10 років",
    achievements: "CrossFit L2 Trainer",
  },
];

const TrainersSection = () => {
  return (
    <section id="trainers" className="section-padding bg-background">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm tracking-widest uppercase">
            Команда
          </span>
          <h2 className="heading-lg text-foreground mt-4">
            Наші <span className="text-gradient">тренери</span>
          </h2>
          <p className="text-body max-w-2xl mx-auto mt-4">
            Професіонали з багаторічним досвідом, які допоможуть вам досягти
            будь-яких спортивних цілей.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trainers.map((trainer, index) => (
            <motion.div
              key={trainer.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-2xl aspect-[3/4] shadow-card">
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent" />
                
                {/* Overlay Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-2xl font-bold text-background">
                      {trainer.name}
                    </h3>
                    <p className="text-primary font-medium mt-1">
                      {trainer.role}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center gap-2 text-sm text-background/80">
                        <Award className="w-4 h-4 text-primary" />
                        {trainer.achievements}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-sm text-background/80">
                        Досвід: {trainer.experience}
                      </span>
                      <button className="ml-auto p-2 bg-primary/20 rounded-full hover:bg-primary/40 transition-colors backdrop-blur-sm">
                        <Instagram className="w-5 h-5 text-primary" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrainersSection;