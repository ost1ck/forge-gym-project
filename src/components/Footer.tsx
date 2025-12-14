import { Instagram, Facebook, Youtube, Send } from "lucide-react";

type FooterProps = {
  compact?: boolean;
  className?: string;
};

const Footer = ({ compact = false, className = "" }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/staprsw?igsh=OGQ5ZDc2ODk2ZA%3D%3D&utm_source=qr", label: "Instagram" },
    { icon: Facebook, href: "/404", label: "Facebook" }, 
    { icon: Youtube, href: "https://www.youtube.com/watch?v=Bcpu-jqAL6w", label: "YouTube" },
    { icon: Send, href: "https://t.me/o_stick", label: "Telegram" },
  ];

  const quickLinks = [
    { label: "Про нас", href: "/about" },
    { label: "Послуги", href: "/#services" },
    { label: "Тренери", href: "/#trainers" },
    { label: "Розклад", href: "/#schedule" },
    { label: "Ціни", href: "/#pricing" },
    { label: "Контакти", href: "/#contact" },
  ];

  // Функція для обробки кліків на посилання
  const handleLinkClick = (href: string) => {
    
    if (!href.includes("#")) {
      window.scrollTo(0, 0);
    }
  };

  return (
    <footer className={`bg-card border-t border-border mt-auto ${className}`}>
      <div className={`container-custom ${compact ? "py-4" : "py-12"}`}>
        
        {!compact && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <a href="/" className="flex items-center gap-3 mb-4" onClick={() => window.scrollTo(0, 0)}>
                <div className="w-11 h-11 bg-gradient-premium rounded-xl flex items-center justify-center shadow-elegant">
                  <span className="text-primary-foreground font-display text-2xl">F</span>
                </div>
                <span className="text-xl font-bold tracking-wide text-foreground">
                  FORGE<span className="text-primary">GYM</span>
                </span>
              </a>
              <p className="text-muted-foreground max-w-md mb-6">
                Преміум тренажерний зал з професійним обладнанням та досвідченими
                тренерами. Куй своє тіло разом з нами!
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith("http") ? "_blank" : "_self"} 
                    rel={social.href.startsWith("http") ? "noopener noreferrer" : ""}
                    aria-label={social.label}
                    className="rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 w-10 h-10"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Навігація</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href} 
                      className="text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => handleLinkClick(link.href)}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacts */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Контакти</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li>вул. Хрещатик, 22, Київ</li>
                <li>+380 (44) 123-45-67</li>
                <li>info@forgegym.ua</li>
                <li>Пн-Нд: 06:00 - 23:00</li>
              </ul>
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div 
          className={`flex flex-col sm:flex-row justify-between items-center gap-4 ${
            compact ? "" : "border-t border-border pt-8"
          }`}
        >
          <p className="text-sm text-muted-foreground">
            © {currentYear} FORGE GYM. Всі права захищені.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
        
            <a 
              href="/privacy" 
              className="hover:text-primary transition-colors"
              onClick={() => window.scrollTo(0, 0)}
            >
              
            </a>
            <a 
              href="/terms" 
              className="hover:text-primary transition-colors"
              onClick={() => window.scrollTo(0, 0)}
            >
              
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;