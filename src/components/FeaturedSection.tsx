import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { MenuItem } from "@/store/useStore";
import ProductDetailsModal from "./ProductDetailsModal";
import { formatCurrency } from "@/lib/utils";
import { warmImageBatch } from "@/lib/imageWarmup";

const FeaturedSection = () => {
  const { items, settings } = useStore();
  const featuredItems = useMemo(
    () => items.filter((i) => i.bestSeller && i.available !== false),
    [items]
  );
  const addToCart = useStore((s) => s.addToCart);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const featuredImageUrls = useMemo(
    () => featuredItems.map((item) => item.image).filter((image): image is string => Boolean(image)),
    [featuredItems]
  );

  useEffect(() => {
    if (featuredImageUrls.length === 0) return;
    warmImageBatch(featuredImageUrls, 4);
  }, [featuredImageUrls]);

  if (featuredItems.length === 0) return null;

  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: shouldReduceMotion ? 0.2 : 0.35 }}
        className="mb-8"
      >
        <h2 className="font-heading text-3xl md:text-4xl text-gold gold-glow tracking-wider text-center">
          ⚡ Baleno Specials
        </h2>
        <p className="text-center text-muted-foreground mt-2 font-body">Our legendary picks</p>
      </motion.div>

      <div
        className="flex gap-4 overflow-x-auto overscroll-x-contain pb-4 px-1 sm:px-2 snap-x snap-mandatory scrollbar-hide"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {featuredItems.map((item, i) => (
          <div
            key={item.id}
            onClick={() => {
              setSelectedItem(item);
              setDetailsOpen(true);
            }}
            className="shrink-0 w-[82vw] max-w-[18rem] md:w-72 snap-start rounded-2xl bg-card p-6
              border border-border/50 hover:border-tertiary/50
              transition-shadow duration-300 group card-3d cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-accent-orange text-lg">⚡</span>
              <span className="text-xs uppercase tracking-widest text-accent-orange font-bold">Best Seller</span>
            </div>
            {item.image && (
              <div className="image-3d-scene mb-4 flex justify-center">
                <div className="image-3d-frame inline-flex rounded-xl overflow-hidden border border-border/60 bg-gradient-to-br from-[#160c06] to-[#2a160c] shadow-[inset_0_0_0_1px_hsl(30_25%_35%/0.15)]">
                  <div className="image-3d-spinner inline-flex">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading={i < 4 ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={i < 3 ? "high" : "auto"}
                        className="image-3d-pic max-h-40 w-auto object-contain p-3"
                      />
                  </div>
                </div>
              </div>
            )}
            <h3 className="font-heading text-xl text-foreground mb-1">{item.name}</h3>
            <p className="font-arabic text-muted-foreground text-sm mb-2" dir="rtl">{item.nameAr}</p>
            {item.description && (
              <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
            )}
            <div className="flex items-center justify-between">
              <span className="price-badge">{formatCurrency(item.price, settings.currency)}</span>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  addToCart(item);
                }}
                className="text-xs text-muted-foreground hover:text-accent transition-colors font-bold uppercase tracking-wider"
              >
                + Add
              </button>
            </div>
          </div>
        ))}
      </div>

      <ProductDetailsModal
        item={selectedItem}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onAddToCart={addToCart}
        currency={settings.currency}
      />
    </section>
  );
};

export default FeaturedSection;
