import { useStore } from "@/store/useStore";

const Footer = () => {
  const { settings } = useStore();

  return (
    <footer className="relative border-t border-border/30 py-12 bg-espresso-deep">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />

      <div className="container mx-auto px-4 text-center space-y-6">
        <p className="font-arabic text-xl text-gold gold-glow" dir="rtl">
          بالينو — القهوة بتبدأ هنا
        </p>

        <div className="flex justify-center gap-6">
          <a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-300 text-sm tracking-wider">
            Facebook
          </a>
          <a href="#" className="text-muted-foreground hover:text-accent transition-colors duration-300 text-sm tracking-wider">
            Instagram
          </a>
        </div>

        <p className="text-muted-foreground text-sm">📞 +{settings.whatsappNumber.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, "$1 $2 $3 $4")}</p>
        {settings.openingHours && <p className="text-muted-foreground text-xs">🕐 {settings.openingHours}</p>}

        <p className="text-muted-foreground/50 text-xs tracking-wider">
          © 2005–2026 {settings.restaurantName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
