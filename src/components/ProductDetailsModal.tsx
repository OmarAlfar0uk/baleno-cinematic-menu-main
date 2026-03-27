import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MenuItem } from "@/store/useStore";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";

interface ProductDetailsModalProps {
  item: MenuItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCart: (item: MenuItem) => void;
  currency: string;
}

const ProductDetailsModal = ({ item, open, onOpenChange, onAddToCart, currency }: ProductDetailsModalProps) => {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-card to-card/80 border-border max-w-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-center"
          >
            {item.image ? (
              <div className="image-3d-scene relative w-full flex items-center justify-center">
                <div className="image-3d-frame w-full rounded-xl overflow-hidden border border-border/50 shadow-xl bg-gradient-to-br from-[#1a1008] to-[#2a160c]">
                <div className="image-3d-spinner w-full inline-flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    className="image-3d-pic w-full h-[320px] md:h-[380px] object-contain p-4"
                  />
                </div>
                {item.bestSeller && (
                  <div className="absolute top-3 right-3 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <span>⚡</span> Best Seller
                  </div>
                )}
                </div>
              </div>
            ) : (
              <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-secondary/10 to-accent/10 border border-border/50 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl mb-3 opacity-50">📸</div>
                  <p className="text-muted-foreground text-sm">No image available</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div>
                <h2 className="font-heading text-3xl text-foreground tracking-wide mb-2">{item.name}</h2>
                <p className="font-arabic text-lg text-muted-foreground" dir="rtl">
                  {item.nameAr}
                </p>
              </div>

              <div className="pt-2 border-t border-border/50">
                <p className="text-2xl font-bold text-secondary mb-1">
                  {formatCurrency(item.price, currency)}
                </p>
              </div>

              {item.description && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Description
                  </h3>
                  <p className="text-foreground/80 leading-relaxed">{item.description}</p>
                </div>
              )}

              {item.descriptionAr && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2" dir="rtl">
                    الوصف
                  </h3>
                  <p className="text-foreground/80 leading-relaxed text-right" dir="rtl">
                    {item.descriptionAr}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    item.available !== false
                      ? "bg-green-500/10 text-green-600 ring-1 ring-green-500/20"
                      : "bg-destructive/10 text-destructive ring-1 ring-destructive/20"
                  }`}
                >
                  {item.available !== false ? "✓ Available" : "Not Available"}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 space-y-2">
              <Button
                onClick={() => {
                  onAddToCart(item);
                  onOpenChange(false);
                }}
                className="w-full bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-secondary-foreground gap-2 shadow-lg h-12 font-semibold"
              >
                <Plus size={18} /> Add to Cart
              </Button>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full border-border/50"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;
