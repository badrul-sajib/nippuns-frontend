import { useRef, useState } from "react";
import { Timer, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useSettings } from "@/contexts/SettingsContext";
import type { Product } from "@/types/product";

interface DealOfTheDayProps {
  products?: Product[];
  loading?: boolean;
}

const SkeletonCard = () => (
  <div className="flex-shrink-0 w-44 sm:w-52 animate-pulse">
    <div className="h-48 rounded-2xl bg-muted/60" />
    <div className="mt-2 h-3 w-3/4 rounded bg-muted/60" />
    <div className="mt-1.5 h-3 w-1/2 rounded bg-muted/60" />
  </div>
);

const DealOfTheDay = ({ products: apiProducts, loading = false }: DealOfTheDayProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { settings } = useSettings();

  const products = (apiProducts || []).slice(0, 16);

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];
  const [active, setActive] = useState("All");

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  const filtered = active === "All" ? products : products.filter(p => p.category === active);

  return (
    <section className="bg-accent/50 py-6 sm:py-10">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-lg sm:rounded-xl bg-primary shadow-md shadow-primary/30">
              <Timer className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-sm sm:text-lg font-bold text-foreground">{settings.section_deal_of_the_day_title}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{settings.section_deal_of_the_day_subtitle}</p>
            </div>
          </div>
          <Link to="/category/deals" className="flex items-center gap-1 rounded-full border border-border px-4 py-1.5 text-xs font-medium text-foreground/70 hover:border-primary/40 hover:text-primary transition-all">
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mb-4 sm:mb-6 flex flex-wrap gap-1.5 sm:gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium transition-all ${
                active === cat
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-background text-muted-foreground border border-border hover:border-primary/40 hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <button onClick={() => scroll("left")} className="absolute left-1 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm text-primary shadow-md border border-border/40 hover:bg-background transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div ref={scrollRef} className="flex gap-3 sm:gap-4 overflow-x-auto px-2 pb-2 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            ) : filtered.length > 0 ? (
              filtered.map((p) => (
                <ProductCard
                  key={p.id}
                  name={p.brand}
                  code={p.code}
                  price={p.price}
                  originalPrice={p.originalPrice}
                  rating={p.rating}
                  reviews={p.reviews || (p as any).reviewCount || 0}
                  color="bg-amber-50/60"
                  image={p.images?.[0]}
                  productId={p.id}
                  showBuyNow
                />
              ))
            ) : null}
          </div>
          <button onClick={() => scroll("right")} className="absolute right-1 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 active:scale-95">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default DealOfTheDay;
