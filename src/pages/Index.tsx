import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import HeroSection from "@/components/HeroSection";
import MenuNav from "@/components/MenuNav";
import MenuSection from "@/components/MenuSection";
import FloatingCart from "@/components/FloatingCart";
import CartDrawer from "@/components/CartDrawer";
import OpeningCurtain from "@/components/OpeningCurtain";
import { useStore } from "@/store/useStore";
import { AnimatePresence, motion } from "framer-motion";

const INTRO_SEEN_KEY = "baleno-intro-seen";
const AdminDashboard = lazy(() => import("@/components/admin/AdminDashboard"));
const FeaturedSection = lazy(() => import("@/components/FeaturedSection"));
const AboutStrip = lazy(() => import("@/components/AboutStrip"));
const Footer = lazy(() => import("@/components/Footer"));
const AdminGate = lazy(() => import("@/components/AdminGate"));

interface IndexProps {
  openAdminOnLoad?: boolean;
}

const Index = ({ openAdminOnLoad = false }: IndexProps) => {
  const { categories, items } = useStore();
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || "");
  const [cartOpen, setCartOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [introDone, setIntroDone] = useState(() => {
    try {
      return localStorage.getItem(INTRO_SEEN_KEY) === "1";
    } catch {
      return false;
    }
  });

  const handleIntroComplete = () => {
    setIntroDone(true);
    try {
      localStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {
      // Ignore storage write failures and continue UX flow.
    }
  };

  useEffect(() => {
    if (!categories.length) {
      if (activeCategory !== "") setActiveCategory("");
      return;
    }

    const stillExists = categories.some((category) => category.id === activeCategory);
    if (!stillExists) setActiveCategory(categories[0].id);
  }, [categories, activeCategory]);

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);

    const target = document.getElementById(`category-${id}`);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Build category data once per categories/items update to avoid repeated filtering work.
  const menuCategories = useMemo(
    () =>
      categories.map((cat) => ({
        ...cat,
        items: items.filter((i) => i.categoryId === cat.id && i.available !== false),
      })),
    [categories, items]
  );

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {!introDone && <OpeningCurtain onComplete={handleIntroComplete} />}
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
            <Suspense fallback={null}>
              <FeaturedSection />
            </Suspense>

            {menuCategories.map((category) => (
              <MenuSection key={category.id} category={category} />
            ))}
          </div>
        </div>

        <Suspense fallback={null}>
          <AboutStrip />
        </Suspense>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>

        <FloatingCart onClick={() => setCartOpen(true)} />
        <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
        <Suspense fallback={null}>
          <AdminGate initialOpen={openAdminOnLoad} onAuthenticated={() => setAdminOpen(true)} />
        </Suspense>
      </motion.div>

      <AnimatePresence>
        {adminOpen && (
          <Suspense
            fallback={
              <div className="fixed inset-0 z-[100] grid place-items-center bg-background/70 backdrop-blur-sm">
                <p className="font-heading text-gold">Loading dashboard...</p>
              </div>
            }
          >
            <AdminDashboard onClose={() => setAdminOpen(false)} />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
