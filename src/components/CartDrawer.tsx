import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/store/useStore";
import { Minus, Plus, ShoppingCart, Trash2, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { useEffect, useState } from "react";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CartDrawer = ({ open, onOpenChange }: CartDrawerProps) => {
  const { branches, currentBranchId, cart, updateCartQuantity, removeFromCart, clearCart, addOrder, settings } = useStore();
  const [customerName, setCustomerName] = useState("");
  const [customerNote, setCustomerNote] = useState("");

  const total = cart.reduce((sum, c) => sum + c.menuItem.price * c.quantity, 0);
  const itemCount = cart.reduce((sum, c) => sum + c.quantity, 0);
  const activeBranch = branches.find((branch) => branch.id === currentBranchId) || branches[0];

  const getCategoryIcon = (categoryId: string) => {
    const { categories } = useStore.getState();
    return categories.find((c) => c.id === categoryId)?.icon || "🍽️";
  };

  const sendWhatsApp = () => {
    if (cart.length === 0) return;
    if (!activeBranch) {
      toast.error("No active branch selected");
      return;
    }

    const trimmedName = customerName.trim();
    const trimmedNote = customerNote.trim();

    if (!trimmedName) {
      toast.error("Please enter your name before sending the order");
      return;
    }

    const whatsappNumber = (activeBranch.whatsappNumber || settings.whatsappNumber).replace(/[^\d]/g, "");
    if (!whatsappNumber) {
      toast.error("Please set a valid WhatsApp number in admin settings");
      return;
    }

    const lines = cart.map(
      (c) => `${getCategoryIcon(c.menuItem.categoryId)} ${c.menuItem.name} x${c.quantity} — ${formatCurrency(c.menuItem.price * c.quantity, settings.currency)}`
    );

    const noteLine = trimmedNote ? `📝 الملاحظة: ${trimmedNote}` : "📝 الملاحظة: لا يوجد";
    const message = `🍽️ طلب جديد من بالينو\n\n🏪 الفرع: ${activeBranch.name}\n👤 الاسم: ${trimmedName}\n${noteLine}\n\n━━━━━━━━━━━━━━━\n${lines.join("\n")}\n━━━━━━━━━━━━━━━\n\n💰 الإجمالي: ${formatCurrency(total, settings.currency)}\n\n━━━━━━━━━━━━━━━\nشكراً لاختيارك بالينو ⚡`;

    const order = {
      id: Math.random().toString(36).substring(2, 10),
      items: [...cart],
      total,
      timestamp: new Date().toISOString(),
      status: "pending" as const,
      branchId: activeBranch.id,
      branchName: activeBranch.name,
      customerName: trimmedName,
      customerNote: trimmedNote,
    };
    addOrder(order);

    const encoded = encodeURIComponent(message);
    const popup = window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, "_blank", "noopener,noreferrer");
    if (popup) popup.opener = null;
    clearCart();
    setCustomerName("");
    setCustomerNote("");
    onOpenChange(false);
  };

  useEffect(() => {
    if (!open) {
      setCustomerName("");
      setCustomerNote("");
    }
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="bg-card border-border w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-heading text-gold gold-glow flex items-center gap-2">
            <ShoppingCart size={20} /> Your Order
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          <AnimatePresence>
            {cart.length === 0 && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-muted-foreground text-center py-12">
                Your cart is empty
              </motion.p>
            )}
            {cart.map((c) => (
              <motion.div
                key={c.menuItem.id}
                layout
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/40 transition-colors"
              >
                {c.menuItem.image && (
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-border/50">
                    <img
                      src={c.menuItem.image}
                      alt={c.menuItem.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm font-medium truncate">{c.menuItem.name}</p>
                  <p className="text-muted-foreground text-xs">{formatCurrency(c.menuItem.price, settings.currency)} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateCartQuantity(c.menuItem.id, c.quantity - 1)}
                    aria-label={`Decrease quantity of ${c.menuItem.name}`}
                    className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-foreground font-bold w-6 text-center">{c.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(c.menuItem.id, c.quantity + 1)}
                    aria-label={`Increase quantity of ${c.menuItem.name}`}
                    className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="text-secondary font-bold text-sm w-16 text-right">
                  {formatCurrency(c.menuItem.price * c.quantity, settings.currency)}
                </span>
                <button
                  onClick={() => removeFromCart(c.menuItem.id)}
                  aria-label={`Remove ${c.menuItem.name} from cart`}
                  className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {cart.length > 0 && (
          <div className="border-t border-border pt-4 space-y-4">
            <div className="space-y-3">
              <div className="rounded-md border border-border bg-muted/60 px-3 py-2 text-sm text-foreground">
                Branch: <span className="font-semibold">{activeBranch?.name || "Not selected"}</span>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Your Name</label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name"
                  className="bg-muted border-border"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Note (optional)</label>
                <Textarea
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder="Any notes for your order"
                  className="bg-muted border-border"
                  rows={2}
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total ({itemCount} items)</span>
              <span className="font-heading text-xl text-gold gold-glow">{formatCurrency(total, settings.currency)}</span>
            </div>
            <Button
              onClick={sendWhatsApp}
              className="w-full h-12 text-base font-bold bg-[#25D366] hover:bg-[#1da851] text-white rounded-xl gap-2"
            >
              <MessageCircle size={20} /> Order via WhatsApp
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
