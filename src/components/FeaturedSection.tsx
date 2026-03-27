import { useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { MenuItem } from "@/store/useStore";
import ProductDetailsModal from "./ProductDetailsModal";
import { formatCurrency } from "@/lib/utils";

const FeaturedSection = () => {
  const DRAG_THRESHOLD = 6;
  const { items, settings } = useStore();
  const featuredItems = useMemo(
    () => items.filter((i) => i.bestSeller && i.available !== false),
    [items]
  );
  const addToCart = useStore((s) => s.addToCart);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const preventClickRef = useRef(false);
  const dragState = useRef({
    pointerId: -1,
    startX: 0,
    startScrollLeft: 0,
    hasDragged: false,
  });

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (!container) return;

    const target = event.target as HTMLElement;
    if (target.closest("button, a, input, textarea, select, [role='button']")) {
      return;
    }

    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: container.scrollLeft,
      hasDragged: false,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (!container || event.pointerId !== dragState.current.pointerId) return;

    const deltaX = event.clientX - dragState.current.startX;

    if (!dragState.current.hasDragged && Math.abs(deltaX) > DRAG_THRESHOLD) {
      dragState.current.hasDragged = true;
      preventClickRef.current = true;
      setIsDragging(true);
      container.setPointerCapture(event.pointerId);
    }

    if (!dragState.current.hasDragged) return;

    container.scrollLeft = dragState.current.startScrollLeft - deltaX;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (!container || event.pointerId !== dragState.current.pointerId) return;

    if (container.hasPointerCapture(event.pointerId)) {
      container.releasePointerCapture(event.pointerId);
    }
    setIsDragging(false);
    dragState.current.pointerId = -1;
    dragState.current.hasDragged = false;
  };

  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!preventClickRef.current) return;

    event.preventDefault();
    event.stopPropagation();
    preventClickRef.current = false;
  };

  if (featuredItems.length === 0) return null;

  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <h2 className="font-heading text-3xl md:text-4xl text-gold gold-glow tracking-wider text-center">
          ⚡ Baleno Specials
        </h2>
        <p className="text-center text-muted-foreground mt-2 font-body">Our legendary picks</p>
      </motion.div>

      <div
        ref={scrollRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClickCapture={handleClickCapture}
        className={`flex gap-5 overflow-x-auto pb-4 px-2 snap-x snap-mandatory scrollbar-hide select-none touch-pan-y ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {featuredItems.slice(0, 5).map((item, i) => (
          <motion.div
            key={item.id}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 40 }}
            whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: shouldReduceMotion ? 0 : i * 0.1 }}
            onClick={() => {
              setSelectedItem(item);
              setDetailsOpen(true);
            }}
            className="shrink-0 w-64 md:w-72 snap-center rounded-2xl bg-card p-6
              shimmer border border-border/50 hover:border-tertiary/50
              transition-all duration-500 group card-3d cursor-pointer"
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
                        loading="lazy"
                        decoding="async"
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
          </motion.div>
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
