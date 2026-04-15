import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const RecentlyViewed = () => {
  const { viewedIds } = useRecentlyViewed();

  const recentProducts = viewedIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 8);

  if (recentProducts.length === 0) return null;

  return (
    <section className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
      <h2 className="mb-6 text-lg sm:text-xl font-bold text-foreground">Recently Viewed</h2>
      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
        {recentProducts.map((p: any) => (
          <ProductCard
            key={p.id}
            name={p.brand}
            code={p.code}
            price={p.price}
            originalPrice={p.originalPrice}
            rating={p.rating}
            reviews={p.reviews}
            color="bg-muted/30"
            image={p.images[0]}
            productId={p.id}
            showBuyNow
          />
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;
