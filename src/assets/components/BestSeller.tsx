import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { products as staticProducts } from "@/data/products";

const BestSeller = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const products = staticProducts.slice(0, 10);

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];
  const [activeTab, setActiveTab] = useState("All");

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  const filtered = activeTab === "All" ? products : products.filter(p => p.category === activeTab);

  return (
    <section className="container mx-auto px-3 sm:px-4 py-6 sm:py-10">
      <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <h2 className="text-sm sm:text-lg font-bold text-foreground">Best Seller</h2>
          <Link to="/category/best-seller" className="flex items-center gap-1 rounded-full border border-border px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-foreground/70 hover:border-primary/40 hover:text-primary transition-all">
            View All <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </Link>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {categories.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium transition-all duration-200 ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "border border-border bg-background text-foreground/70 hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="relative">
        <button onClick={() => scroll("left")} className="absolute left-1 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm text-primary shadow-md border border-border/40 hover:bg-background transition-colors">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div ref={scrollRef} className="flex gap-3 sm:gap-4 overflow-x-auto px-2 pb-2 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              name={p.brand}
              code={p.code}
              price={p.price}
              originalPrice={p.originalPrice}
              rating={p.rating}
              reviews={p.reviews}
              color="bg-purple-50/60"
              image={p.images[0]}
              productId={p.id}
              showBuyNow
            />
          ))}
        </div>
        <button onClick={() => scroll("right")} className="absolute right-1 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 active:scale-95">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
};

export default BestSeller;
