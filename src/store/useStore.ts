import { create } from "zustand";
import { publishedContent } from "@/lib/publishedContent";

export interface MenuItem {
  id: string;
  name: string;
  nameAr: string;
  description?: string;
  descriptionAr?: string;
  price: number;
  image?: string;
  bestSeller?: boolean;
  available?: boolean;
  categoryId: string;
}

export interface MenuCategory {
  id: string;
  label: string;
  labelAr?: string;
  icon: string;
}

export interface Branch {
  id: string;
  name: string;
  whatsappNumber: string;
  address?: string;
  isActive?: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  timestamp: string;
  status: "pending" | "done";
  branchId: string;
  branchName: string;
  customerName?: string;
  customerNote?: string;
}

export interface Settings {
  restaurantName: string;
  whatsappNumber: string;
  heroTagline: string;
  currency: string;
  openingHours: string;
}

interface Store {
  branches: Branch[];
  currentBranchId: string;
  categories: MenuCategory[];
  items: MenuItem[];
  cart: CartItem[];
  orders: Order[];
  settings: Settings;

  addBranch: (branch: Omit<Branch, "id">) => void;
  updateBranch: (id: string, branch: Partial<Branch>) => void;
  deleteBranch: (id: string) => void;
  setCurrentBranch: (id: string) => void;

  addCategory: (cat: Omit<MenuCategory, "id">) => void;
  updateCategory: (id: string, cat: Partial<MenuCategory>) => void;
  deleteCategory: (id: string) => void;

  addItem: (item: Omit<MenuItem, "id">) => void;
  restoreItem: (item: MenuItem) => void;
  updateItem: (id: string, item: Partial<MenuItem>) => void;
  deleteItem: (id: string) => void;

  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;

  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: "pending" | "done") => void;
  clearOrders: () => void;

  updateSettings: (s: Partial<Settings>) => void;
}

const STORAGE_KEY = "baleno-local";
const LEGACY_STORAGE_KEY = "baleno-store";

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

function buildFallbackBranch(settings: Settings): Branch {
  return {
    id: "main-branch",
    name: `${settings.restaurantName} Main Branch`,
    whatsappNumber: settings.whatsappNumber,
    isActive: true,
  };
}

function resolveBranches(): Branch[] {
  return publishedContent.branches.length > 0
    ? (publishedContent.branches as Branch[])
    : [buildFallbackBranch(publishedContent.settings as Settings)];
}

function resolveCurrentBranchId(branches: Branch[], preferredBranchId?: string | null) {
  if (preferredBranchId && branches.some((branch) => branch.id === preferredBranchId)) {
    return preferredBranchId;
  }

  if (branches.some((branch) => branch.id === publishedContent.currentBranchId)) {
    return publishedContent.currentBranchId;
  }

  return branches[0]?.id || "";
}

function normalizeOrders(rawOrders: Partial<Order>[] | undefined, branches: Branch[]) {
  const fallbackBranch = branches[0];

  return (rawOrders || []).map((order) => ({
    ...order,
    branchId: order.branchId || fallbackBranch?.id || "",
    branchName: order.branchName || fallbackBranch?.name || "",
    status: order.status === "done" ? "done" : "pending",
    items: order.items || [],
    total: typeof order.total === "number" ? order.total : 0,
    timestamp: order.timestamp || new Date().toISOString(),
    id: order.id || generateId(),
  })) as Order[];
}

function loadFromStorage(): Partial<Store> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return {
      currentBranchId: typeof parsed.currentBranchId === "string" ? parsed.currentBranchId : undefined,
      cart: Array.isArray(parsed.cart) ? parsed.cart : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
    };
  } catch {}

  return null;
}

function saveToStorage(state: Pick<Store, "currentBranchId" | "cart" | "orders">) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        currentBranchId: state.currentBranchId,
        cart: state.cart,
        orders: state.orders,
      })
    );
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {}
}

function getInitialData() {
  const saved = loadFromStorage();
  const branches = resolveBranches();
  const currentBranchId = resolveCurrentBranchId(branches, saved?.currentBranchId as string | undefined);

  return {
    branches,
    currentBranchId,
    categories: publishedContent.categories as MenuCategory[],
    items: publishedContent.items as MenuItem[],
    cart: (saved?.cart || []) as CartItem[],
    orders: normalizeOrders(saved?.orders as Partial<Order>[] | undefined, branches),
    settings: publishedContent.settings as Settings,
  };
}

const initial = getInitialData();

export const useStore = create<Store>((set) => ({
  branches: initial.branches,
  currentBranchId: initial.currentBranchId,
  categories: initial.categories,
  items: initial.items,
  cart: initial.cart,
  orders: initial.orders,
  settings: initial.settings,

  addBranch: (branch) => {
    set((s) => {
      const branches = [...s.branches, { ...branch, id: generateId() }];
      const currentBranchId = s.currentBranchId || branches[0]?.id || "";
      return { branches, currentBranchId };
    });
  },
  updateBranch: (id, branch) => {
    set((s) => {
      const branches = s.branches.map((b) => (b.id === id ? { ...b, ...branch } : b));
      return { branches };
    });
  },
  deleteBranch: (id) => {
    set((s) => {
      if (s.branches.length <= 1) return {};

      const branches = s.branches.filter((branch) => branch.id !== id);
      const currentBranchId = s.currentBranchId === id ? branches[0]?.id || "" : s.currentBranchId;
      saveToStorage({ currentBranchId, cart: s.cart, orders: s.orders });
      return { branches, currentBranchId };
    });
  },
  setCurrentBranch: (id) => {
    set((s) => {
      if (!s.branches.some((branch) => branch.id === id)) return {};
      saveToStorage({ currentBranchId: id, cart: s.cart, orders: s.orders });
      return { currentBranchId: id };
    });
  },

  addCategory: (cat) => {
    set((s) => {
      const categories = [...s.categories, { ...cat, id: generateId() }];
      return { categories };
    });
  },
  updateCategory: (id, cat) => {
    set((s) => {
      const categories = s.categories.map((c) => (c.id === id ? { ...c, ...cat } : c));
      return { categories };
    });
  },
  deleteCategory: (id) => {
    set((s) => {
      const categories = s.categories.filter((c) => c.id !== id);
      const items = s.items.filter((i) => i.categoryId !== id);
      return { categories, items };
    });
  },

  addItem: (item) => {
    set((s) => {
      const items = [...s.items, { ...item, id: generateId() }];
      return { items };
    });
  },
  restoreItem: (item) => {
    set((s) => {
      const exists = s.items.some((existing) => existing.id === item.id);
      const items = exists ? s.items : [...s.items, item];
      return { items };
    });
  },
  updateItem: (id, item) => {
    set((s) => {
      const items = s.items.map((i) => (i.id === id ? { ...i, ...item } : i));
      return { items };
    });
  },
  deleteItem: (id) => {
    set((s) => {
      const items = s.items.filter((i) => i.id !== id);
      return { items };
    });
  },

  addToCart: (item) => {
    set((s) => {
      const existing = s.cart.find((c) => c.menuItem.id === item.id);
      if (existing) {
        const cart = s.cart.map((c) => (c.menuItem.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
        saveToStorage({ currentBranchId: s.currentBranchId, cart, orders: s.orders });
        return { cart };
      }

      const cart = [...s.cart, { menuItem: item, quantity: 1 }];
      saveToStorage({ currentBranchId: s.currentBranchId, cart, orders: s.orders });
      return { cart };
    });
  },
  removeFromCart: (itemId) => {
    set((s) => {
      const cart = s.cart.filter((c) => c.menuItem.id !== itemId);
      saveToStorage({ currentBranchId: s.currentBranchId, cart, orders: s.orders });
      return { cart };
    });
  },
  updateCartQuantity: (itemId, quantity) => {
    set((s) => {
      if (quantity <= 0) {
        const cart = s.cart.filter((c) => c.menuItem.id !== itemId);
        saveToStorage({ currentBranchId: s.currentBranchId, cart, orders: s.orders });
        return { cart };
      }

      const cart = s.cart.map((c) => (c.menuItem.id === itemId ? { ...c, quantity } : c));
      saveToStorage({ currentBranchId: s.currentBranchId, cart, orders: s.orders });
      return { cart };
    });
  },
  clearCart: () => {
    set((s) => {
      saveToStorage({ currentBranchId: s.currentBranchId, cart: [], orders: s.orders });
      return { cart: [] };
    });
  },

  addOrder: (order) => {
    set((s) => {
      const orders = [order, ...s.orders];
      saveToStorage({ currentBranchId: s.currentBranchId, cart: s.cart, orders });
      return { orders };
    });
  },
  updateOrderStatus: (id, status) => {
    set((s) => {
      const orders = s.orders.map((o) => (o.id === id ? { ...o, status } : o));
      saveToStorage({ currentBranchId: s.currentBranchId, cart: s.cart, orders });
      return { orders };
    });
  },
  clearOrders: () => {
    set((s) => {
      saveToStorage({ currentBranchId: s.currentBranchId, cart: s.cart, orders: [] });
      return { orders: [] };
    });
  },

  updateSettings: (newSettings) => {
    set((s) => {
      const settings = { ...s.settings, ...newSettings };
      return { settings };
    });
  },
}));
