import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ShimmerImage from "@/components/ShimmerImage";
import { fetchCategories } from "@/api/categories";
import type { Category } from "@/types/product";

import catLadiesBag from "@/assets/cat-ladies-bag.png";
import catTravelBag from "@/assets/cat-travel-bag.png";
import catMensBag from "@/assets/cat-mens-bag.png";
import catGymBag from "@/assets/cat-gym-bag.png";
import catSchoolBag from "@/assets/cat-school-bag.png";
import catJewellery from "@/assets/cat-jewellery.png";
import catUmbrella from "@/assets/cat-umbrella.png";
import catPrayerMat from "@/assets/cat-prayer-mat.png";

// Fallback images mapped by category slug
const slugImages: Record<string, string> = {
  "ladies-bag": catLadiesBag,
  "travel-bag": catTravelBag,
  "mens-bag": catMensBag,
  "gym-bag": catGymBag,
  "school-bag": catSchoolBag,
  "jewelry-watches": catJewellery,
  "umbrella": catUmbrella,
  "prayer-mat": catPrayerMat,
  "baby-bag": catLadiesBag,
};

const Categories = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchCategories()
      .then((data) => {
        if (cancelled) return;
        const items: Category[] = data?.data || data || [];
        // Hide empty categories like "Live Gallery" with 0 products
        setCategories(items.filter((c) => (c.products_count ?? (c as any).productCount ?? 1) > 0));
      })
      .catch(() => setCategories([]));
    return () => { cancelled = true; };
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
    }
  };

  return (
    <section className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <h2 className="mb-4 sm:mb-6 text-base sm:text-lg font-semibold text-foreground">Categories</h2>
      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm text-primary shadow-md border border-border/40 hover:bg-background transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div ref={scrollRef} className="flex gap-3 sm:gap-4 overflow-x-auto px-6 sm:px-8 pb-2 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
          {categories.map((cat) => {
            const img = cat.image || slugImages[cat.slug] || catLadiesBag;
            return (
              <button
                key={cat.id}
                onClick={() => navigate(`/category/${cat.slug}`)}
                className="group flex min-w-[110px] sm:min-w-[145px] flex-col items-center justify-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl p-3 sm:p-5 transition-all duration-200 border-2 border-transparent bg-muted/50 hover:bg-accent hover:shadow-sm hover:border-dashed hover:border-primary"
              >
                <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center">
                  <ShimmerImage
                    src={img}
                    alt={cat.name}
                    className="h-10 w-10 sm:h-14 sm:w-14 object-contain transition-transform duration-200 group-hover:scale-110 rounded-lg"
                    shimmerClassName="h-10 w-10 sm:h-14 sm:w-14 rounded-lg"
                    loading="eager"
                    decoding="async"
                  />
                </div>
                <span className="text-center text-xs font-medium text-foreground">{cat.name}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 active:scale-95"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
};

export default Categories;
