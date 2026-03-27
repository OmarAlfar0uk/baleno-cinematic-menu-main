import { useMemo, useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Check, Clock, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type DateFilter = "all" | "today" | "last7" | "month";

const AdminOrders = () => {
  const { branches, currentBranchId, orders, updateOrderStatus, clearOrders, settings } = useStore();
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [branchFilter, setBranchFilter] = useState<string>("current");
  const defaultBranch = branches[0];

  const filteredOrders = useMemo(() => {
    const now = new Date();

    return orders.filter((order) => {
      const orderBranchId = order.branchId || defaultBranch?.id || "";

      if (branchFilter === "current" && orderBranchId !== currentBranchId) return false;
      if (branchFilter !== "all" && branchFilter !== "current" && orderBranchId !== branchFilter) return false;

      if (dateFilter === "all") return true;

      const orderDate = new Date(order.timestamp);
      if (Number.isNaN(orderDate.getTime())) return false;

      if (dateFilter === "today") {
        return orderDate.toDateString() === now.toDateString();
      }

      if (dateFilter === "last7") {
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        return orderDate >= sevenDaysAgo;
      }

      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return orderDate >= monthStart;
    });
  }, [orders, dateFilter, branchFilter, currentBranchId, defaultBranch]);

  return (
    <div>
      <div className="space-y-3 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="font-heading text-xl text-foreground">WhatsApp Orders</h2>
          {orders.length > 0 && (
            <Button onClick={clearOrders} variant="outline" className="text-destructive border-destructive/50 gap-2 w-full sm:w-auto">
              <Trash2 size={14} /> Clear All
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="h-10 rounded-md border border-border bg-muted px-3 text-sm text-foreground"
            aria-label="Filter orders by branch"
          >
            <option value="current">Current Branch</option>
            <option value="all">All Branches</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as DateFilter)}
            className="h-10 rounded-md border border-border bg-muted px-3 text-sm text-foreground"
            aria-label="Filter orders by date"
          >
            <option value="all">All Orders</option>
            <option value="today">Today</option>
            <option value="last7">Last 7 Days</option>
            <option value="month">This Month</option>
          </select>

          <div className="rounded-lg border border-border bg-card px-3 py-2">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Filtered Orders</p>
            <p className="text-lg font-heading text-foreground">{filteredOrders.length}</p>
          </div>

          <div className="rounded-lg border border-border bg-card px-3 py-2">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Pending</p>
            <p className="text-lg font-heading text-foreground">{filteredOrders.filter((order) => order.status === "pending").length}</p>
          </div>
        </div>

      </div>

      {filteredOrders.length === 0 && (
        <p className="text-muted-foreground text-center py-16">No orders yet</p>
      )}

      <div className="space-y-3">
        {filteredOrders.map((order) => (
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
            <div className="mb-3 space-y-1">
              <p className="text-sm text-foreground">
                <span className="text-muted-foreground">Branch:</span> {order.branchName || branches.find((branch) => branch.id === order.branchId)?.name || defaultBranch?.name || "Main Branch"}
              </p>
              <p className="text-sm text-foreground">
                <span className="text-muted-foreground">Customer:</span> {order.customerName || "Unknown"}
              </p>
              {order.customerNote && (
                <p className="text-sm text-muted-foreground">
                  <span className="text-muted-foreground">Note:</span> {order.customerNote}
                </p>
              )}
            </div>
            <div className="space-y-1 mb-3">
              {order.items.map((c, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-foreground">{c.menuItem.name} x{c.quantity}</span>
                  <span className="text-muted-foreground">{formatCurrency(c.menuItem.price * c.quantity, settings.currency)}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-border pt-3">
              <span className="font-heading text-gold">Total: {formatCurrency(order.total, settings.currency)}</span>
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
