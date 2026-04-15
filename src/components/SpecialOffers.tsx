import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Percent, Clock } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products as staticProducts } from "@/data/products";

const useCountdown = () => {
  const getTarget = () => {
    const now = new Date();
    const target = new Date(now);
    target.setHours(23, 59, 59, 999);
    return target.getTime();
  };

  const calc = () => {
    const diff = Math.max(0, getTarget() - Date.now());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { hours: h, minutes: m, seconds: s };
  };

  const [time, setTime] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  return time;
};

const pad = (n: number) => String(n).padStart(2, "0");

const SpecialOffers = () => {
  const { hours, minutes, seconds } = useCountdown();

  const discounted = [...staticProducts]
    .map((p) => ({
      ...p,
      discount: Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100),
    }))
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 10);

  return (
    <section className="py-4 sm:py-6 md:py-8 bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6 rounded-2xl bg-primary/5 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-primary/10">
              <Percent className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-sm sm:text-lg md:text-xl font-bold text-foreground leading-tight">Special Offers</h2>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Biggest discounts across the store</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Clock className="hidden sm:block h-4 w-4 text-primary" />
            <span className="hidden sm:inline text-xs font-medium text-muted-foreground">Ends in</span>
            <div className="flex items-center gap-1">
              {[
                { value: pad(hours), label: "Hrs" },
                { value: pad(minutes), label: "Min" },
                { value: pad(seconds), label: "Sec" },
              ].map((t, i) => (
                <div key={t.label} className="flex items-center gap-1">
                  {i > 0 && <span className="text-sm font-bold text-primary">:</span>}
                  <div className="flex flex-col items-center rounded-lg bg-primary px-1.5 sm:px-2 py-0.5 sm:py-1 min-w-[32px] sm:min-w-[36px] shadow-md shadow-primary/25">
                    <span className="text-xs sm:text-sm font-bold text-primary-foreground leading-tight tabular-nums">{t.value}</span>
                    <span className="text-[7px] sm:text-[8px] text-primary-foreground/70 uppercase">{t.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/category/special-offers"
            className="flex items-center gap-1 rounded-full border border-border px-3 sm:px-4 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium text-foreground/70 hover:border-primary/40 hover:text-primary transition-all"
          >
            Shop All <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {discounted.map((p) => (
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
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
