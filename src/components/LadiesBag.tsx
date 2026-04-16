import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { fetchCategoryProducts } from "@/api/categories";
import { useSettings } from "@/contexts/SettingsContext";
import type { Product } from "@/types/product";

const SkeletonCard = () => (
  <div className="flex-shrink-0 w-44 sm:w-52 animate-pulse">
    <div className="h-48 rounded-2xl bg-muted/60" />
    <div className="mt-2 h-3 w-3/4 rounded bg-muted/60" />
    <div className="mt-1.5 h-3 w-1/2 rounded bg-muted/60" />
  </div>
);

const LadiesBag = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { settings } = useSettings();
  const slug = settings.featured_category_slug || "ladies-bag";
  const title = settings.featured_category_title || "Featured";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchCategoryProducts(slug)
      .then((data) => {
        if (cancelled) return;
        const items: Product[] = data?.data || data || [];
        setProducts(items.slice(0, 10));
      })
      .catch(() => setProducts([]))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  if (!loading && products.length === 0) return null;

  return (
    <section className="container mx-auto px-3 sm:px-4 py-6 sm:py-10">
      <div className="mb-4 sm:mb-6 flex items-center justify-between">
        <h2 className="text-sm sm:text-lg font-bold text-foreground">{title}</h2>
        <Link to={`/category/${slug}`} className="flex items-center gap-1 rounded-full border border-border px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-foreground/70 hover:border-primary/40 hover:text-primary transition-all">
          View All <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </Link>
      </div>
      <div className="relative">
        <button onClick={() => scroll("left")} className="absolute left-1 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm text-primary shadow-md border border-border/40 hover:bg-background transition-colors">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div ref={scrollRef} className="flex gap-3 sm:gap-4 overflow-x-auto px-2 pb-2 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((p) => (
                <ProductCard
                  key={p.id}
                  name={p.brand}
                  code={p.code}
                  price={p.price}
                  originalPrice={p.originalPrice}
                  rating={p.rating}
                  reviews={p.reviews || (p as any).reviewCount || 0}
                  color="bg-rose-50/60"
                  image={p.images?.[0]}
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

export default LadiesBag;
