import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"; 

const PricingSection = () => {
  const plans = [
    {
      name: "BASIC",
      price: "900",
      description: "Для тих, хто знає свій шлях",
      features: [
        "Безлімітний доступ до залу",
        "Доступ до роздягальні та душу",
        "Вступний інструктаж",
        "Питна вода",
      ],
      popular: false,
    },
    {
      name: "STANDARD",
      price: "1500",
      description: "Оптимальний вибір для результату",
      features: [
        "Все, що в Basic",
        "Групові заняття (12/міс)",
        "Заморозка абонементу (7 днів)",
        "Гостьовий візит (1/міс)",
        "Доступ до сауни",
      ],
      popular: true,
    },
    {
      name: "PREMIUM",
      price: "2500",
      description: "Максимальний комфорт та увага",
      features: [
        "Все, що в Standard",
        "Персональні тренування (4/міс)",
        "Безлімітна заморозка",
        "Власний шкафчик",
        "Рушники та халат",
        "Спортивне харчування (знижка 10%)",
      ],
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="section-padding bg-background">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm tracking-widest uppercase">
            Інвестиція в себе
          </span>
          <h2 className="heading-lg text-foreground mt-4">
            Оберіть свій <span className="text-gradient">рівень</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className={`relative p-8 rounded-2xl border ${
                plan.popular
                  ? "border-primary bg-card shadow-glow scale-105 z-10"
                  : "border-border bg-card/50"
              } flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Хіт продажів
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-lg font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-xl font-bold text-muted-foreground">₴</span>
                  <span className="text-muted-foreground">/міс</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/trial" onClick={() => window.scrollTo(0, 0)}>
                <Button 
                  variant={plan.popular ? "hero" : "outline"} 
                  className="w-full"
                >
                  Обрати тариф
                </Button>
              </Link>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;