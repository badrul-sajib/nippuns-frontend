import { useEffect, useState } from "react";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { fetchProduct } from "@/api/products";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";

const RecentlyViewed = () => {
  const { viewedIds } = useRecentlyViewed();
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;
    if (viewedIds.length === 0) {
      setRecentProducts([]);
      return;
    }
    const ids = viewedIds.slice(0, 8);
    Promise.all(
      ids.map((id) =>
        fetchProduct(id)
          .then((data) => (data?.product || data?.data || data) as Product)
          .catch(() => null)
      )
    ).then((results) => {
      if (cancelled) return;
      setRecentProducts(results.filter(Boolean) as Product[]);
    });
    return () => { cancelled = true; };
  }, [viewedIds]);

  if (recentProducts.length === 0) return null;

  return (
    <section className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
      <h2 className="mb-6 text-lg sm:text-xl font-bold text-foreground">Recently Viewed</h2>
      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
        {recentProducts.map((p) => (
          <ProductCard
            key={p.id}
            name={p.brand}
            code={p.code}
            price={p.price}
            originalPrice={p.originalPrice}
            rating={p.rating}
            reviews={p.reviews || (p as any).reviewCount || 0}
            color="bg-muted/30"
            image={p.images?.[0]}
            productId={p.id}
            showBuyNow
          />
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;
