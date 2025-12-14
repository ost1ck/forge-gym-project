import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Про нас", href: "/about" },
  { label: "Послуги", href: "/#services" },
  { label: "Тренери", href: "/#trainers" },
  { label: "Розклад", href: "/#schedule" },
  { label: "Ціни", href: "/#pricing" },
  { label: "Контакти", href: "/#contact" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const location = useLocation();
  const isTrialPage = location.pathname === "/trial";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Функція для плавної прокрутки (для логотипа)
  const scrollToTopSmooth = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Функція для миттєвої прокрутки (для переходу на нову сторінку)
  const scrollToTopInstant = () => {
    window.scrollTo(0, 0);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-elegant border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container-custom">
        <nav className="flex items-center justify-between h-20">
          
          {/* Логотип: плавна прокрутка */}
          <Link 
            to="/" 
            className="flex items-center gap-3"
            onClick={scrollToTopSmooth}
          >
            <div className="w-11 h-11 bg-gradient-premium rounded-xl flex items-center justify-center shadow-elegant">
              <span className="text-primary-foreground font-bold text-xl">F</span>
            </div>
            <span className="text-xl font-bold tracking-wide text-foreground">
              FORGE<span className="text-primary">GYM</span>
            </span>
          </Link>

          {/* Навігація десктоп */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Кнопка Trial десктоп */}
          <div className="hidden lg:block">
            {!isTrialPage && (
              <Link 
                to="/trial" 
                onClick={scrollToTopInstant} 
              >
                <Button variant="hero" size="lg">
                  Записатись на пробне
                </Button>
              </Link>
            )}
          </div>

          {/* Мобільне меню (кнопка) */}
          <button
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Мобільне меню (випадайка) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background/98 backdrop-blur-lg border-b border-border shadow-elegant"
          >
            <div className="container-custom py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              
              {!isTrialPage && (
                <Link 
                  to="/trial" 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    scrollToTopInstant(); 
                  }}
                >
                  <Button variant="hero" size="lg" className="mt-4 w-full">
                    Записатись на пробне
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;