import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Check, Clock, Trash2 } from "lucide-react";

const AdminOrders = () => {
  const { orders, updateOrderStatus, clearOrders, settings } = useStore();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="font-heading text-xl text-foreground">WhatsApp Orders</h2>
        {orders.length > 0 && (
          <Button onClick={clearOrders} variant="outline" className="text-destructive border-destructive/50 gap-2 w-full sm:w-auto">
            <Trash2 size={14} /> Clear All
          </Button>
        )}
      </div>

      {orders.length === 0 && (
        <p className="text-muted-foreground text-center py-16">No orders yet</p>
      )}

      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="rounded-xl bg-card border border-border p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <span className="text-muted-foreground text-xs">
                {new Date(order.timestamp).toLocaleString("en-EG")}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                order.status === "done"
                  ? "bg-[#22c55e]/20 text-[#22c55e]"
                  : "bg-secondary/20 text-secondary"
              }`}>
                {order.status === "done" ? "Done" : "Pending"}
              </span>
            </div>
            <div className="space-y-1 mb-3">
              {order.items.map((c, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-foreground">{c.menuItem.name} x{c.quantity}</span>
                  <span className="text-muted-foreground">{c.menuItem.price * c.quantity} {settings.currency}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-border pt-3">
              <span className="font-heading text-gold">Total: {order.total} {settings.currency}</span>
              <Button
                size="sm"
                onClick={() => updateOrderStatus(order.id, order.status === "done" ? "pending" : "done")}
                className={`w-full sm:w-auto ${order.status === "done" ? "bg-muted text-muted-foreground" : "bg-[#22c55e] text-white hover:bg-[#16a34a]"}`}
              >
                {order.status === "done" ? <><Clock size={14} /> Reopen</> : <><Check size={14} /> Mark Done</>}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
