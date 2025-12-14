import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const ContactSection = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Адреса",
      content: "вул. Хрещатик, 22, Київ",
    },
    {
      icon: Phone,
      title: "Телефон",
      content: "+380 (44) 123-45-67",
    },
    {
      icon: Mail,
      title: "Email",
      content: "info@forgegym.ua",
    },
    {
      icon: Clock,
      title: "Графік роботи",
      content: "Пн-Нд: 06:00 - 23:00",
    },
  ];

  return (
    <section id="contact" className="section-padding bg-secondary/30">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm tracking-widest uppercase">
            Контакти
          </span>
          <h2 className="heading-lg text-foreground mt-4">
            Знайдіть <span className="text-gradient">нас</span>
          </h2>
          <p className="text-body max-w-2xl mx-auto mt-4">
            Зручне розташування в центрі міста. Власна парковка для клієнтів.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          
          {/* Ліва колонка: Інформаційні картки */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 content-center"
          >
            {contactInfo.map((item, index) => (
              <div
                key={item.title}
                className="flex flex-col items-center text-center sm:items-start sm:text-left p-6 rounded-2xl bg-card border border-border shadow-card hover:border-primary/50 transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-premium flex items-center justify-center shadow-elegant mb-4 text-primary-foreground">
                  <item.icon className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-lg text-foreground mb-2">{item.title}</h4>
                <p className="text-muted-foreground">
                  {item.content}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Права колонка: Карта */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-[400px] lg:h-auto min-h-[400px] rounded-2xl overflow-hidden border border-border shadow-card"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2540.932454379374!2d30.520448976953935!3d50.442347387979685!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4ce56a642217d%3A0x6b8ed086a9926868!2z0LLRg9C7LiDQpdGA0LXRidCw0YLQuNC6LCAyMiwg0JrQuNGX0LIsIDAyMDAw!5e0!3m2!1suk!2sua!4v1709666000000!5m2!1suk!2sua"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;