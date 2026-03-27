import { MenuCategory } from "@/store/useStore";

interface MenuNavProps {
  categories: MenuCategory[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

const MenuNav = ({ categories, activeCategory, onCategoryChange }: MenuNavProps) => {
  return (
    <nav className="sticky top-0 z-50 glass-nav py-3">
      <div className="container mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-body
                transition-all duration-300 shrink-0
                ${activeCategory === cat.id
                  ? "text-secondary shadow-[0_2px_0_hsl(var(--secondary)),var(--gold-glow)] bg-muted/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
                }`}
            >
              <span>{cat.icon}</span>
              <span className="tracking-wide">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default MenuNav;
