import type { MenuCategory, MenuItem } from "@/store/useStore";

export const ADMIN_ITEMS_PER_PAGE = 8;
export type AvailabilityFilter = "all" | "available" | "unavailable";
export type ItemSort = "newest" | "name-asc" | "price-asc" | "price-desc";

export function filterMenuItems(items: MenuItem[], categories: MenuCategory[], query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return items;

  return items.filter((item) => {
    const categoryLabel = categories.find((category) => category.id === item.categoryId)?.label.toLowerCase() || "";
    return (
      item.name.toLowerCase().includes(normalized) ||
      item.nameAr.toLowerCase().includes(normalized) ||
      categoryLabel.includes(normalized)
    );
  });
}

export function filterByAvailability(items: MenuItem[], availability: AvailabilityFilter) {
  if (availability === "all") return items;
  return items.filter((item) => (availability === "available" ? item.available !== false : item.available === false));
}

export function sortMenuItems(items: MenuItem[], sortBy: ItemSort, sourceOrder?: Map<string, number>) {
  const sorted = [...items];

  switch (sortBy) {
    case "name-asc":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      return sorted;
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      return sorted;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      return sorted;
    case "newest":
    default:
      if (!sourceOrder) return sorted.reverse();
      sorted.sort((a, b) => (sourceOrder.get(b.id) ?? 0) - (sourceOrder.get(a.id) ?? 0));
      return sorted;
  }
}

export function getMenuItemStats(items: MenuItem[]) {
  const total = items.length;
  const unavailable = items.filter((item) => item.available === false).length;
  const available = total - unavailable;
  const averagePrice = total ? items.reduce((sum, item) => sum + item.price, 0) / total : 0;

  return {
    total,
    available,
    unavailable,
    averagePrice,
  };
}

export function paginateItems<T>(items: T[], currentPage: number, itemsPerPage = ADMIN_ITEMS_PER_PAGE) {
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const start = (safePage - 1) * itemsPerPage;
  const paginated = items.slice(start, start + itemsPerPage);

  return {
    paginated,
    totalPages,
    safePage,
    start,
    end: Math.min(start + itemsPerPage, items.length),
  };
}
