import { motion, useReducedMotion } from "framer-motion";
import { MenuCategory, MenuItem } from "@/store/useStore";
import MenuCard from "./MenuCard";

interface MenuSectionProps {
  category: MenuCategory & { items: MenuItem[] };
}

const MenuSection = ({ category }: MenuSectionProps) => {
  const shouldReduceMotion = useReducedMotion();

  if (category.items.length === 0) return null;

  return (
    <section id={`category-${category.id}`} className="py-12 scroll-mt-28">
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
        whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: shouldReduceMotion ? 0.2 : 0.35 }}
        className="flex items-center gap-4 mb-8"
      >
        <span className="text-3xl">{category.icon}</span>
        <h2 className="font-heading text-2xl md:text-3xl text-gold gold-glow tracking-wider">
          {category.label}
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-secondary/50 to-transparent" />
        <span className="text-accent-orange">⚡</span>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {category.items.map((item, i) => (
          <MenuCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </section>
  );
};

export default MenuSection;
