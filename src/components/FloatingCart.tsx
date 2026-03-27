import { ShoppingCart } from "lucide-react";
import { useStore } from "@/store/useStore";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface FloatingCartProps {
  onClick: () => void;
}

const FloatingCart = ({ onClick }: FloatingCartProps) => {
  const cart = useStore((s) => s.cart);
  const count = cart.reduce((sum, c) => sum + c.quantity, 0);
  const shouldReduceMotion = useReducedMotion();

  if (count === 0) return null;

  return (
    <motion.button
      initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { scale: 1 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0 }}
      onClick={onClick}
      aria-label={`Open cart (${count} items)`}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent text-accent-foreground
        shadow-[0_0_25px_hsl(24_100%_55%/0.5)] flex items-center justify-center
        hover:scale-110 transition-transform"
    >
      <ShoppingCart size={22} />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { scale: 1 }}
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-secondary text-secondary-foreground
              text-xs font-bold flex items-center justify-center"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default FloatingCart;
