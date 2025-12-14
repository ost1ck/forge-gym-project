import { motion } from "framer-motion";
import { Dumbbell, Users, Heart, Timer } from "lucide-react";

const services = [
  {
    icon: Dumbbell,
    title: "Тренажерний Зал",
    description:
      "Понад 200 одиниць професійного обладнання преміум-класу від провідних світових брендів.",
  },
  {
    icon: Users,
    title: "Персональні Тренування",
    description:
      "Індивідуальні програми від сертифікованих тренерів для досягнення ваших цілей.",
  },
  {
    icon: Heart,
    title: "Групові Заняття",
    description:
      "Йога, пілатес, кросфіт, бокс та інші групові програми для різних рівнів підготовки.",
  },
  {
    icon: Timer,
    title: "Функціональний Тренінг",
    description:
      "Сучасна функціональна зона для HIIT, кругових та інтервальних тренувань.",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="section-padding bg-secondary/30">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm tracking-widest uppercase">
            Наші Послуги
          </span>
          <h2 className="heading-lg text-foreground mt-4">
            Все для вашого <span className="text-gradient">успіху</span>
          </h2>
          <p className="text-body max-w-2xl mx-auto mt-4">
            Ми створили простір, де кожна деталь продумана для максимальної
            ефективності ваших тренувань.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-500 shadow-card hover:shadow-glow"
            >
              <div className="w-14 h-14 bg-gradient-premium rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-elegant">
                <service.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;