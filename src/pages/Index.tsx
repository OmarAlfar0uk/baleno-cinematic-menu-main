import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import MenuNav from "@/components/MenuNav";
import MenuSection from "@/components/MenuSection";
import FeaturedSection from "@/components/FeaturedSection";
import AboutStrip from "@/components/AboutStrip";
import Footer from "@/components/Footer";
import FloatingCart from "@/components/FloatingCart";
import CartDrawer from "@/components/CartDrawer";
import AdminGate from "@/components/AdminGate";
import AdminDashboard from "@/components/admin/AdminDashboard";
import OpeningCurtain from "@/components/OpeningCurtain";
import { useStore } from "@/store/useStore";
import { AnimatePresence, motion } from "framer-motion";

const Index = () => {
  const { categories, items } = useStore();
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || "");
  const [cartOpen, setCartOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);

    const target = document.getElementById(`category-${id}`);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Build category data with items for display
  const menuCategories = categories.map((cat) => ({
    ...cat,
    items: items.filter((i) => i.categoryId === cat.id && i.available !== false),
  }));

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {!introDone && <OpeningCurtain onComplete={() => setIntroDone(true)} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: introDone ? 1 : 0 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
      >
        <HeroSection />

        <div id="menu">
          <MenuNav
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />

          <div className="container mx-auto px-4">
            <FeaturedSection />

            {menuCategories.map((category) => (
              <MenuSection key={category.id} category={category} />
            ))}
          </div>
        </div>

        <AboutStrip />
        <Footer />

        <FloatingCart onClick={() => setCartOpen(true)} />
        <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
        <AdminGate onAuthenticated={() => setAdminOpen(true)} />
      </motion.div>

      <AnimatePresence>
        {adminOpen && <AdminDashboard onClose={() => setAdminOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default Index;
