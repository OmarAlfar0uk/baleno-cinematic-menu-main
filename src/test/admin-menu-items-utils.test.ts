import { describe, expect, it } from "vitest";
import {
  ADMIN_ITEMS_PER_PAGE,
  filterByAvailability,
  filterMenuItems,
  getMenuItemStats,
  paginateItems,
  sortMenuItems,
} from "@/components/admin/adminMenuItems.utils";
import type { MenuCategory, MenuItem } from "@/store/useStore";

const categories: MenuCategory[] = [
  { id: "hot", label: "Hot Drinks", icon: "☕" },
  { id: "cold", label: "Cold Drinks", icon: "🧊" },
];

const items: MenuItem[] = [
  { id: "1", name: "Espresso", nameAr: "إسبريسو", price: 30, categoryId: "hot", available: true },
  { id: "2", name: "Iced Latte", nameAr: "لاتيه بارد", price: 55, categoryId: "cold" },
  { id: "3", name: "Cappuccino", nameAr: "كابتشينو", price: 45, categoryId: "hot", available: false },
];

describe("admin menu item filtering", () => {
  it("filters by english name, arabic name, and category", () => {
    expect(filterMenuItems(items, categories, "espresso")).toHaveLength(1);
    expect(filterMenuItems(items, categories, "بارد")).toHaveLength(1);
    expect(filterMenuItems(items, categories, "hot drinks")).toHaveLength(2);
  });

  it("returns all items when query is empty", () => {
    expect(filterMenuItems(items, categories, "")).toHaveLength(items.length);
    expect(filterMenuItems(items, categories, "   ")).toHaveLength(items.length);
  });
});

describe("admin availability and sorting", () => {
  it("filters by availability", () => {
    expect(filterByAvailability(items, "available")).toHaveLength(2);
    expect(filterByAvailability(items, "unavailable")).toHaveLength(1);
    expect(filterByAvailability(items, "all")).toHaveLength(3);
  });

  it("sorts by price and name", () => {
    expect(sortMenuItems(items, "price-asc").map((item) => item.id)).toEqual(["1", "3", "2"]);
    expect(sortMenuItems(items, "price-desc").map((item) => item.id)).toEqual(["2", "3", "1"]);
    expect(sortMenuItems(items, "name-asc").map((item) => item.id)).toEqual(["3", "1", "2"]);
  });

  it("computes summary stats", () => {
    const stats = getMenuItemStats(items);
    expect(stats.total).toBe(3);
    expect(stats.available).toBe(2);
    expect(stats.unavailable).toBe(1);
    expect(stats.averagePrice).toBeCloseTo((30 + 55 + 45) / 3, 5);
  });
});

describe("admin menu item pagination", () => {
  it("paginates items with stable boundaries", () => {
    const fifteen = Array.from({ length: 15 }, (_, i) => i + 1);
    const pageTwo = paginateItems(fifteen, 2, ADMIN_ITEMS_PER_PAGE);

    expect(pageTwo.totalPages).toBe(2);
    expect(pageTwo.paginated).toHaveLength(7);
    expect(pageTwo.start).toBe(8);
    expect(pageTwo.end).toBe(15);
  });

  it("clamps invalid page values", () => {
    const result = paginateItems([1, 2, 3], 99, 2);
    expect(result.safePage).toBe(2);
    expect(result.paginated).toEqual([3]);
  });
});
