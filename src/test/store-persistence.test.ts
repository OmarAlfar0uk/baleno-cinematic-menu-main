import { beforeEach, describe, expect, it, vi } from "vitest";

const STORAGE_KEY = "baleno-local";
const storage = window.localStorage as Storage;

const buildStoredState = () => ({
  categories: [],
  items: [],
  cart: [
    {
      menuItem: {
        id: "demo-item",
        name: "Demo",
        nameAr: "ديمو",
        price: 10,
        categoryId: "cat-1",
      },
      quantity: 2,
    },
  ],
  orders: [],
  settings: {
    restaurantName: "Baleno",
    whatsappNumber: "201226801925",
    heroTagline: "Tagline",
    currency: "EGP",
    openingHours: "8:00 AM - 12:00 AM",
  },
});

describe("store cart persistence", () => {
  beforeEach(() => {
    if (typeof storage.removeItem === "function") {
      storage.removeItem(STORAGE_KEY);
    } else {
      storage.setItem(STORAGE_KEY, "");
    }
    vi.resetModules();
  });

  it("hydrates cart from localStorage", async () => {
    storage.setItem(STORAGE_KEY, JSON.stringify(buildStoredState()));

    const { useStore } = await import("@/store/useStore");
    expect(useStore.getState().cart).toHaveLength(1);
    expect(useStore.getState().cart[0].quantity).toBe(2);
  });

  it("persists cart updates back to localStorage", async () => {
    const { useStore } = await import("@/store/useStore");
    const firstItem = useStore.getState().items[0];

    useStore.getState().addToCart(firstItem);
    useStore.getState().updateCartQuantity(firstItem.id, 3);

    const raw = storage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();

    const parsed = JSON.parse(raw || "{}");
    expect(parsed.cart).toHaveLength(1);
    expect(parsed.cart[0].quantity).toBe(3);

    useStore.getState().clearCart();
    const parsedAfterClear = JSON.parse(storage.getItem(STORAGE_KEY) || "{}");
    expect(parsedAfterClear.cart).toEqual([]);
  });
});
