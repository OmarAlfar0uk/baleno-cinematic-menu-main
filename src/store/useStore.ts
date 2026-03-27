import { create } from "zustand";
import { menuData as defaultMenuData } from "@/data/menuData";

export interface MenuItem {
  id: string;
  name: string;
  nameAr: string;
  description?: string;
  descriptionAr?: string;
  price: number;
  image?: string; // Base64 image
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
}

export interface Settings {
  restaurantName: string;
  whatsappNumber: string;
  heroTagline: string;
  currency: string;
  openingHours: string;
}

interface Store {
  categories: MenuCategory[];
  items: MenuItem[];
  cart: CartItem[];
  orders: Order[];
  settings: Settings;

  // Categories
  addCategory: (cat: Omit<MenuCategory, "id">) => void;
  updateCategory: (id: string, cat: Partial<MenuCategory>) => void;
  deleteCategory: (id: string) => void;

  // Items
  addItem: (item: Omit<MenuItem, "id">) => void;
  updateItem: (id: string, item: Partial<MenuItem>) => void;
  deleteItem: (id: string) => void;

  // Cart
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;

  // Orders
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: "pending" | "done") => void;
  clearOrders: () => void;

  // Settings
  updateSettings: (s: Partial<Settings>) => void;
}

const STORAGE_KEY = "baleno-store";

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

function loadFromStorage(): Partial<Store> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveToStorage(state: Partial<Store>) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        categories: state.categories,
        items: state.items,
        orders: state.orders,
        settings: state.settings,
      })
    );
  } catch {}
}

// Convert initial data
function getInitialData() {
  const saved = loadFromStorage();
  if (saved?.categories && saved?.items) {
    return {
      categories: saved.categories as MenuCategory[],
      items: saved.items as MenuItem[],
      orders: (saved.orders || []) as Order[],
      settings: (saved.settings || getDefaultSettings()) as Settings,
    };
  }

  const categories: MenuCategory[] = defaultMenuData.map((c) => ({
    id: c.id,
    label: c.label,
    icon: c.icon,
  }));

  const items: MenuItem[] = defaultMenuData.flatMap((c) =>
    c.items.map((item) => ({
      id: generateId(),
      name: item.name,
      nameAr: item.nameAr,
      description: item.description,
      price: item.price,
      bestSeller: item.bestSeller,
      available: true,
      categoryId: c.id,
    }))
  );

  return { categories, items, orders: [] as Order[], settings: getDefaultSettings() };
}

function getDefaultSettings(): Settings {
  return {
    restaurantName: "Baleno",
    whatsappNumber: "201226801925",
    heroTagline: "Est. 2005 — Where Energy Meets Flavor",
    currency: "EGP",
    openingHours: "8:00 AM – 12:00 AM",
  };
}

const initial = getInitialData();

export const useStore = create<Store>((set, get) => ({
  categories: initial.categories,
  items: initial.items,
  cart: [],
  orders: initial.orders,
  settings: initial.settings,

  addCategory: (cat) => {
    set((s) => {
      const categories = [...s.categories, { ...cat, id: generateId() }];
      saveToStorage({ ...s, categories });
      return { categories };
    });
  },
  updateCategory: (id, cat) => {
    set((s) => {
      const categories = s.categories.map((c) => (c.id === id ? { ...c, ...cat } : c));
      saveToStorage({ ...s, categories });
      return { categories };
    });
  },
  deleteCategory: (id) => {
    set((s) => {
      const categories = s.categories.filter((c) => c.id !== id);
      const items = s.items.filter((i) => i.categoryId !== id);
      saveToStorage({ ...s, categories, items });
      return { categories, items };
    });
  },

  addItem: (item) => {
    set((s) => {
      const items = [...s.items, { ...item, id: generateId() }];
      saveToStorage({ ...s, items });
      return { items };
    });
  },
  updateItem: (id, item) => {
    set((s) => {
      const items = s.items.map((i) => (i.id === id ? { ...i, ...item } : i));
      saveToStorage({ ...s, items });
      return { items };
    });
  },
  deleteItem: (id) => {
    set((s) => {
      const items = s.items.filter((i) => i.id !== id);
      saveToStorage({ ...s, items });
      return { items };
    });
  },

  addToCart: (item) => {
    set((s) => {
      const existing = s.cart.find((c) => c.menuItem.id === item.id);
      if (existing) {
        return { cart: s.cart.map((c) => (c.menuItem.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)) };
      }
      return { cart: [...s.cart, { menuItem: item, quantity: 1 }] };
    });
  },
  removeFromCart: (itemId) => {
    set((s) => ({ cart: s.cart.filter((c) => c.menuItem.id !== itemId) }));
  },
  updateCartQuantity: (itemId, quantity) => {
    set((s) => {
      if (quantity <= 0) return { cart: s.cart.filter((c) => c.menuItem.id !== itemId) };
      return { cart: s.cart.map((c) => (c.menuItem.id === itemId ? { ...c, quantity } : c)) };
    });
  },
  clearCart: () => set({ cart: [] }),

  addOrder: (order) => {
    set((s) => {
      const orders = [order, ...s.orders];
      saveToStorage({ ...s, orders });
      return { orders };
    });
  },
  updateOrderStatus: (id, status) => {
    set((s) => {
      const orders = s.orders.map((o) => (o.id === id ? { ...o, status } : o));
      saveToStorage({ ...s, orders });
      return { orders };
    });
  },
  clearOrders: () => {
    set((s) => {
      saveToStorage({ ...s, orders: [] });
      return { orders: [] };
    });
  },

  updateSettings: (newSettings) => {
    set((s) => {
      const settings = { ...s.settings, ...newSettings };
      saveToStorage({ ...s, settings });
      return { settings };
    });
  },
}));
