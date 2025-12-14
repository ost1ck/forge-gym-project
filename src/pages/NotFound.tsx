import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dumbbell, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
      
      {/* Фоновий декор*/}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        {/* Велика цифра 404 на фоні */}
        <h1 className="text-[150px] font-black text-foreground/5 leading-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none -z-10">
          404
        </h1>

        <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-elegant text-primary">
            <Dumbbell className="w-12 h-12" />
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Ви заблукали в залі?
        </h2>
        
        <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
          Схоже, цієї сторінки не існує. Можливо, вона "на масі", або ми її прибрали. 
          Повертайтеся на головну, там безпечніше.
        </p>

        <Link to="/">
          <Button variant="hero" size="lg" className="group">
            <Home className="mr-2 w-5 h-5" />
            На Головну
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;