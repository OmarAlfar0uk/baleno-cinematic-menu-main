import rawSiteContent from "@/content/site.json";

export interface PublishedMenuItem {
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

export interface PublishedMenuCategory {
  id: string;
  label: string;
  labelAr?: string;
  icon: string;
}

export interface PublishedBranch {
  id: string;
  name: string;
  whatsappNumber: string;
  address?: string;
  isActive?: boolean;
}

export interface PublishedSettings {
  restaurantName: string;
  whatsappNumber: string;
  heroTagline: string;
  currency: string;
  openingHours: string;
}

export interface PublishedSiteContent {
  settings: PublishedSettings;
  branches: PublishedBranch[];
  currentBranchId: string;
  categories: PublishedMenuCategory[];
  items: PublishedMenuItem[];
}

const fallbackSettings: PublishedSettings = {
  restaurantName: "Baleno",
  whatsappNumber: "201226801925",
  heroTagline: "Est. 2005 - Where Energy Meets Flavor",
  currency: "EGP",
  openingHours: "8:00 AM - 12:00 AM",
};

function normalizeSettings(settings?: Partial<PublishedSettings>): PublishedSettings {
  return {
    restaurantName: settings?.restaurantName || fallbackSettings.restaurantName,
    whatsappNumber: settings?.whatsappNumber || fallbackSettings.whatsappNumber,
    heroTagline: settings?.heroTagline || fallbackSettings.heroTagline,
    currency: settings?.currency || fallbackSettings.currency,
    openingHours: settings?.openingHours || fallbackSettings.openingHours,
  };
}

function normalizeBranches(branches: PublishedBranch[] | undefined, settings: PublishedSettings): PublishedBranch[] {
  if (!Array.isArray(branches) || branches.length === 0) {
    return [
      {
        id: "main-branch",
        name: `${settings.restaurantName} Main Branch`,
        whatsappNumber: settings.whatsappNumber,
        isActive: true,
      },
    ];
  }

  return branches
    .filter((branch) => branch && typeof branch.id === "string" && typeof branch.name === "string")
    .map((branch) => ({
      id: branch.id,
      name: branch.name,
      whatsappNumber: branch.whatsappNumber || settings.whatsappNumber,
      address: branch.address || "",
      isActive: branch.isActive !== false,
    }));
}

function normalizeCategories(categories: PublishedMenuCategory[] | undefined): PublishedMenuCategory[] {
  if (!Array.isArray(categories)) return [];

  return categories
    .filter((category) => category && typeof category.id === "string" && typeof category.label === "string")
    .map((category) => ({
      id: category.id,
      label: category.label,
      labelAr: category.labelAr || "",
      icon: category.icon || "🍽️",
    }));
}

function normalizeItems(items: PublishedMenuItem[] | undefined): PublishedMenuItem[] {
  if (!Array.isArray(items)) return [];

  return items
    .filter(
      (item) =>
        item &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.nameAr === "string" &&
        typeof item.categoryId === "string"
    )
    .map((item) => ({
      id: item.id,
      name: item.name,
      nameAr: item.nameAr,
      description: item.description || "",
      descriptionAr: item.descriptionAr || "",
      price: typeof item.price === "number" ? item.price : 0,
      image: item.image || "",
      bestSeller: item.bestSeller === true,
      available: item.available !== false,
      categoryId: item.categoryId,
    }));
}

export function normalizePublishedContent(input: Partial<PublishedSiteContent> | undefined): PublishedSiteContent {
  const settings = normalizeSettings(input?.settings);
  const branches = normalizeBranches(input?.branches, settings);
  const currentBranchId =
    typeof input?.currentBranchId === "string" && branches.some((branch) => branch.id === input.currentBranchId)
      ? input.currentBranchId
      : branches[0]?.id || "";

  return {
    settings,
    branches,
    currentBranchId,
    categories: normalizeCategories(input?.categories),
    items: normalizeItems(input?.items),
  };
}

export const publishedContent = normalizePublishedContent(rawSiteContent as Partial<PublishedSiteContent>);
