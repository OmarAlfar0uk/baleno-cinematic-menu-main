import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const Counter = ({ target, label }: { target: number; label: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-heading text-4xl md:text-5xl text-gold gold-glow">{count}+</div>
      <div className="text-muted-foreground text-sm tracking-widest uppercase mt-2">{label}</div>
    </div>
  );
};

const AboutStrip = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-espresso-deep" />

      {/* Steam elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[20, 40, 60, 80].map((left) => (
          <div
            key={left}
            className="absolute bottom-0"
            style={{ left: `${left}%` }}
          >
            <div
              className="w-px h-32 opacity-[0.06]"
              style={{
                background: "linear-gradient(to top, hsl(var(--neutral)), transparent)",
                animation: `steam-rise ${4 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-cream/80 font-body text-lg md:text-xl max-w-2xl mx-auto mb-14 leading-relaxed"
        >
          Since 2005, Baleno has been powering Cairo's mornings with bold flavors
          and electric energy. Every cup tells a story.
        </motion.p>

        <div className="flex justify-center gap-12 md:gap-20">
          <Counter target={20} label="Years" />
          <Counter target={50} label="Menu Items" />
          <Counter target={1000} label="Happy Customers" />
        </div>
      </div>
    </section>
  );
};

export default AboutStrip;
