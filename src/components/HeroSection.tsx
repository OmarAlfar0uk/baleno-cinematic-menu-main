import { motion } from "framer-motion";
import balenoLogo from "@/assets/baleno-logo.png";

const Particles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            left: `${Math.random() * 100}%`,
            background: i % 2 === 0
              ? "hsl(40 40% 55%)"
              : "hsl(24 100% 55%)",
            boxShadow: i % 2 === 0
              ? "0 0 6px hsl(40 40% 55% / 0.6)"
              : "0 0 6px hsl(24 100% 55% / 0.6)",
            animation: `particle-float ${8 + Math.random() * 8}s linear infinite`,
            animationDelay: `${Math.random() * 8}s`,
            ["--drift" as string]: `${(Math.random() - 0.5) * 100}px`,
          }}
        />
      ))}
    </div>
  );
};

const HeroSection = () => {
  const scrollToMenu = () => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-espresso">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 animate-gradient-shift"
        style={{
          background: "linear-gradient(135deg, hsl(20 45% 8%), hsl(20 45% 5%), hsl(20 45% 10%))",
        }}
      />

      {/* Subtle grain texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <Particles />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 mb-6"
      >
        <motion.img
          src={balenoLogo}
          alt="Baleno Logo"
          className="w-32 h-32 md:w-44 md:h-44 object-contain animate-pulse-glow"
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-10 text-gold gold-glow font-heading text-4xl md:text-6xl lg:text-7xl font-bold tracking-wider mb-4 text-center"
      >
        Welcome to Baleno
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative z-10 text-terracotta font-heading text-lg md:text-xl tracking-widest mb-10"
      >
        Est. 2005 — Cairo, Egypt
      </motion.p>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        onClick={scrollToMenu}
        className="relative z-10 group px-8 py-4 rounded-full font-heading text-lg tracking-wider
          bg-gradient-to-r from-accent to-tertiary text-accent-foreground
          shadow-lg hover:shadow-[0_0_30px_hsl(24_100%_55%/0.5)] transition-all duration-300
          hover:scale-105 active:scale-95"
      >
        <span className="relative z-10">Explore Menu</span>
        <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300
          bg-gradient-to-r from-tertiary to-accent" />
      </motion.button>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 z-10 flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div style={{ animation: "scroll-bounce 2s ease-in-out infinite" }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4L10 16M10 16L4 10M10 16L16 10" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
