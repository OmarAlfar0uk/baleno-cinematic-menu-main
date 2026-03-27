import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { X, ClipboardList, FolderOpen, ShoppingCart, Settings, LogOut, Menu, BarChart3 } from "lucide-react";
import balenoLogo from "@/assets/baleno-logo.png";
import AdminMenuItems from "./AdminMenuItems";
import AdminCategories from "./AdminCategories";
import AdminOrders from "./AdminOrders";
import AdminSettings from "./AdminSettings";
import AdminReports from "./AdminReports";
import { motion } from "framer-motion";

interface AdminDashboardProps {
  onClose: () => void;
}

type Tab = "items" | "categories" | "orders" | "reports" | "settings";

const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "items", label: "Menu Items", icon: <ClipboardList size={18} /> },
  { id: "categories", label: "Categories", icon: <FolderOpen size={18} /> },
  { id: "orders", label: "Orders", icon: <ShoppingCart size={18} /> },
  { id: "reports", label: "Reports", icon: <BarChart3 size={18} /> },
  { id: "settings", label: "Settings", icon: <Settings size={18} /> },
];

const AdminDashboard = ({ onClose }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("items");
  const [clock, setClock] = useState(new Date());
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { items, categories, orders } = useStore();

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const todayOrders = orders.filter(
    (o) => new Date(o.timestamp).toDateString() === new Date().toDateString()
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex bg-background"
    >
      {mobileNavOpen && (
        <button
          onClick={() => setMobileNavOpen(false)}
          className="lg:hidden absolute inset-0 bg-black/50 z-10"
          aria-label="Close navigation"
        />
      )}

      {/* Sidebar */}
      <div
        className={`w-56 shrink-0 flex flex-col bg-espresso-deep border-r border-border
          absolute lg:static left-0 top-0 bottom-0 z-20 transition-transform duration-300
          ${mobileNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="p-4 flex items-center gap-3">
          <img src={balenoLogo} alt="Baleno" className="w-10 h-10 object-contain" />
          <span className="font-heading text-sm text-gold gold-glow">Admin</span>
          <button
            onClick={() => setMobileNavOpen(false)}
            className="ml-auto lg:hidden text-muted-foreground hover:text-foreground"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map((nav) => (
            <button
              key={nav.id}
              onClick={() => {
                setActiveTab(nav.id);
                setMobileNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                ${activeTab === nav.id
                  ? "bg-muted/40 text-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
                }`}
            >
              {nav.icon}
              {nav.label}
            </button>
          ))}
        </nav>

        <div className="p-3">
          <button
            onClick={onClose}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-muted/20 transition-colors"
          >
            <LogOut size={16} /> Exit Dashboard
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="min-h-14 border-b border-border flex items-center justify-between px-4 lg:px-6 py-3 lg:py-0 shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden text-muted-foreground hover:text-foreground"
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
            <h1 className="font-heading text-base lg:text-lg text-foreground truncate">Baleno Admin Panel</h1>
          </div>
          <div className="flex items-center gap-3 lg:gap-4">
            <span className="hidden sm:inline text-muted-foreground text-xs lg:text-sm font-mono">
              {clock.toLocaleDateString("en-EG", { weekday: "short", month: "short", day: "numeric" })}{" "}
              {clock.toLocaleTimeString("en-EG", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X size={18} />
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4 p-4 lg:p-6 shrink-0">
          {[
            { label: "Total Items", value: items.length },
            { label: "Categories", value: categories.length },
            { label: "Today's Orders", value: todayOrders },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-card border border-border p-3 lg:p-4">
              <p className="text-muted-foreground text-xs uppercase tracking-wider">{s.label}</p>
              <p className="font-heading text-xl lg:text-2xl text-gold mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 lg:px-6 pb-6">
          {activeTab === "items" && <AdminMenuItems />}
          {activeTab === "categories" && <AdminCategories />}
          {activeTab === "orders" && <AdminOrders />}
          {activeTab === "reports" && <AdminReports />}
          {activeTab === "settings" && <AdminSettings />}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
