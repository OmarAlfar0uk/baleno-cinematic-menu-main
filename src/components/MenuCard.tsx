import { motion, useReducedMotion } from "framer-motion";
import { useStore, MenuItem } from "@/store/useStore";
import { Plus } from "lucide-react";
import { useState } from "react";
import ProductDetailsModal from "./ProductDetailsModal";
import { formatCurrency } from "@/lib/utils";

interface MenuCardProps {
  item: MenuItem;
  index: number;
}

const MenuCard = ({ item, index }: MenuCardProps) => {
  const addToCart = useStore((s) => s.addToCart);
  const settings = useStore((s) => s.settings);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
        whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: shouldReduceMotion ? 0.2 : 0.5, delay: shouldReduceMotion ? 0 : index * 0.08 }}
        onClick={() => setDetailsOpen(true)}
        className="card-3d glow-border rounded-xl bg-card p-5 flex flex-col gap-3 cursor-pointer group hover:shadow-xl transition-all duration-300"
      >
        {/* Image Section */}
        {item.image && (
          <div className="image-3d-scene relative mb-3 pt-1 flex justify-center">
            <div className="image-3d-frame inline-flex rounded-xl border border-border/60 bg-gradient-to-br from-[#160c06] to-[#2a160c] shadow-[inset_0_0_0_1px_hsl(30_25%_35%/0.15)] overflow-hidden">
              <div className="image-3d-spinner inline-flex">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  decoding="async"
                  className="image-3d-pic max-h-40 w-auto object-contain p-2"
                />
              </div>
            </div>
          </div>
        )}

        {item.bestSeller && (
          <div className="flex items-center gap-1 text-xs text-accent-orange font-bold tracking-wider uppercase">
            <span>⚡</span> Best Seller
          </div>
        )}

        <div>
          <h3 className="font-heading text-lg text-foreground tracking-wide">{item.name}</h3>
          <p className="font-arabic text-muted-foreground text-sm mt-0.5" dir="rtl">{item.nameAr}</p>
        </div>

        {item.description && (
          <p className="text-muted-foreground text-sm font-body line-clamp-2">{item.description}</p>
        )}

        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="price-badge">{formatCurrency(item.price, settings.currency)}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(item);
            }}
            className="flex items-center gap-1 text-xs text-muted-foreground tracking-wider uppercase
              group-hover:text-accent transition-colors duration-300 font-bold
              hover:animate-pulse"
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </motion.div>

      <ProductDetailsModal
        item={item}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onAddToCart={addToCart}
        currency={settings.currency}
      />
    </>
  );
};

export default MenuCard;
