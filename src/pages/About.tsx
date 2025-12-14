import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const About = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col font-inter">
      <Header />

      <main className="flex-grow pt-20">
        <section className="relative py-24 lg:py-36 overflow-hidden bg-background">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
          
          <div className="container-custom relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <span className="text-primary font-bold text-sm tracking-[0.2em] uppercase mb-6 block">
                Філософія Forge
              </span>
              <h1 className="heading-xl text-foreground mb-8 leading-tight">
                Ми не продаємо абонементи. <br />
                <span className="text-gradient">Ми змінюємо спосіб життя.</span>
              </h1>
              <p className="text-2xl text-muted-foreground font-light leading-relaxed max-w-2xl">
                У світі, повному шуму та швидких рішень, ми створили місце для концентрації на головному. Тут немає "легких шляхів". Є тільки твій шлях.
              </p>
            </motion.div>
          </div>
        </section>

        {/* --- MANIFESTO SECTION: */}
        <section className="py-20 border-y border-border bg-card/30">
          <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Ліва частина: Великий типографічний акцент */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <h2 className="text-5xl lg:text-7xl font-bold text-foreground/5 leading-none absolute -top-12 -left-8 select-none">
                IRON
              </h2>
              <h3 className="heading-lg relative z-10">
                Культура <br />
                <span className="text-primary">дисципліни</span>
              </h3>
            </motion.div>

            {/* Права частина: Текст маніфесту */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-lg text-muted-foreground space-y-6"
            >
              <p>
                Ми віримо, що тренажерний зал — це не просто кімната з залізом. Це лабораторія людського потенціалу. Коли ти переступаєш поріг FORGE GYM, ти залишаєш за дверима всі "не можу" та "завтра".
              </p>
              <p>
                Наша мета — не просто дати тобі гантелі. Наша мета — дати тобі оточення, в якому неможливо не прогресувати. Тут тренується еліта, і ти стаєш частиною цієї еліти.
              </p>
            </motion.div>
          </div>
        </section>

        
        <section className="py-24 bg-background">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "1500", label: "кв.м. простору" },
                { number: "24/7", label: "доступ до залу" },
                { number: "50+", label: "преміум тренажерів" },
                { number: "∞", label: "можливостей" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-primary uppercase tracking-widest font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- IMAGE / ATMOSPHERE BLOCK --- */}
        <section className="h-[50vh] relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-secondary to-background opacity-80 group-hover:scale-105 transition-transform duration-700" />
          
          <div className="absolute inset-0 flex items-center justify-center">
             <Link to="/trial"
              onClick={() => window.scrollTo(0, 0)}
              className="group/btn relative px-8 py-4 bg-transparent border border-primary/30 text-foreground text-lg font-medium tracking-wide hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 rounded-full flex items-center gap-3 backdrop-blur-sm">
                Прийти і побачити на власні очі
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
             </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default About;