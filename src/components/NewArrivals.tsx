import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useSettings } from "@/contexts/SettingsContext";
import type { Product } from "@/types/product";

interface NewArrivalsProps {
  products?: Product[];
  loading?: boolean;
}

const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="h-48 rounded-2xl bg-muted/60" />
    <div className="mt-2 h-3 w-3/4 rounded bg-muted/60" />
    <div className="mt-1.5 h-3 w-1/2 rounded bg-muted/60" />
  </div>
);

const NewArrivals = ({ products: apiProducts, loading = false }: NewArrivalsProps) => {
  const { settings } = useSettings();
  const products = (apiProducts || []).slice(0, 10);

  return (
    <section className="py-6 sm:py-10 md:py-14">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-base sm:text-xl md:text-2xl font-bold text-foreground">{settings.section_new_arrivals_title}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{settings.section_new_arrivals_subtitle}</p>
          </div>
          <Link to="/category/new-arrivals" className="flex items-center gap-1 rounded-full border border-border px-4 py-1.5 text-xs font-medium text-foreground/70 hover:border-primary/40 hover:text-primary transition-all">
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
          ) : products.length > 0 ? (
            products.map((p) => (
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
                isNew
              />
            ))
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
