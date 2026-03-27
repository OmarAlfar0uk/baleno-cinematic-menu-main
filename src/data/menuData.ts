export interface MenuItem {
  name: string;
  nameAr: string;
  description?: string;
  price: number;
  bestSeller?: boolean;
}

export interface MenuCategory {
  id: string;
  label: string;
  icon: string;
  items: MenuItem[];
}

export const menuData: MenuCategory[] = [
  {
    id: "hot-drinks",
    label: "Hot Drinks",
    icon: "☕",
    items: [
      { name: "Espresso", nameAr: "إسبريسو", description: "Rich & Bold", price: 30, bestSeller: true },
      { name: "Cappuccino", nameAr: "كابتشينو", description: "Creamy Foam", price: 45, bestSeller: true },
      { name: "Turkish Coffee", nameAr: "قهوة تركي", description: "Traditional", price: 35 },
      { name: "Hot Chocolate", nameAr: "شوكولاتة ساخنة", description: "Velvety", price: 50 },
    ],
  },
  {
    id: "cold-drinks",
    label: "Cold Drinks",
    icon: "🧊",
    items: [
      { name: "Iced Latte", nameAr: "لاتيه بارد", description: "Chilled Perfection", price: 55 },
      { name: "Frappuccino", nameAr: "فرابتشينو", description: "Blended Magic", price: 60, bestSeller: true },
      { name: "Iced Matcha", nameAr: "ماتشا بارد", description: "Japanese Vibes", price: 65 },
      { name: "Cold Brew", nameAr: "كولد برو", description: "Slow Steeped", price: 60 },
    ],
  },
  {
    id: "fresh-juices",
    label: "Fresh Juices",
    icon: "🧃",
    items: [
      { name: "Mango", nameAr: "منجة", price: 40, bestSeller: true },
      { name: "Orange", nameAr: "برتقال", price: 35 },
      { name: "Mixed Berry", nameAr: "فراولة مكس", price: 50 },
    ],
  },
  {
    id: "desserts",
    label: "Desserts",
    icon: "🍰",
    items: [
      { name: "Tiramisu", nameAr: "تيراميسو", description: "Italian Classic", price: 70, bestSeller: true },
      { name: "Cheesecake", nameAr: "تشيزكيك", description: "NY Style", price: 65 },
      { name: "Brownie", nameAr: "براوني", description: "Warm & Gooey", price: 55 },
    ],
  },
  {
    id: "sandwiches",
    label: "Sandwiches",
    icon: "🥪",
    items: [
      { name: "Club Sandwich", nameAr: "كلاب ساندويتش", description: "Triple Deck", price: 85 },
      { name: "Grilled Chicken", nameAr: "دجاج مشوي", description: "Smoky Flavor", price: 90, bestSeller: true },
      { name: "Tuna Melt", nameAr: "تونة ميلت", description: "Crispy Bread", price: 75 },
    ],
  },
  {
    id: "breakfast",
    label: "Breakfast",
    icon: "🍳",
    items: [
      { name: "Full English", nameAr: "إفطار إنجليزي", description: "Hearty Start", price: 120, bestSeller: true },
      { name: "Pancakes", nameAr: "بان كيك", description: "Fluffy & Sweet", price: 80 },
      { name: "Avocado Toast", nameAr: "أفوكادو توست", price: 95 },
    ],
  },
];

export const featuredItems = menuData
  .flatMap((c) => c.items)
  .filter((i) => i.bestSeller);
