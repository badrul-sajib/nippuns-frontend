import { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ShoppingBag, SlidersHorizontal, X, ArrowLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

const categoryMeta: Record<string, { title: string; description: string }> = {
  "Ladies Bag": { title: "Ladies Bag", description: "Explore our elegant collection of ladies bags — from totes to clutches, designed to complement every outfit." },
  "Travel Bag": { title: "Travel Bag", description: "Durable & stylish travel bags for your next adventure. Built to carry everything you need." },
  "Men's Bag": { title: "Men's Bag", description: "Premium men's bags — backpacks, briefcases, and messenger bags for every occasion." },
  "Gym Bag": { title: "Gym Bag", description: "Spacious and sturdy gym bags to carry your workout essentials in style." },
  "Baby Bag": { title: "Baby Bag", description: "Functional and fashionable baby bags for parents on the go." },
  "School Bag": { title: "School Bag", description: "Comfortable and colorful school bags for kids and students." },
  "Jewelry & Watches": { title: "Jewelry & Watches", description: "Discover stunning jewellery and watches to elevate your look." },
  Jewellery: { title: "Jewellery", description: "Discover stunning jewellery pieces to elevate your look." },
  Umbrella: { title: "Umbrella", description: "Stay dry in style with our premium umbrella collection." },
  "Prayer Matt": { title: "Prayer Matt", description: "Beautiful prayer matts crafted with care and comfort." },
  New: { title: "New Arrivals", description: "Check out the latest additions to our collection." },
};

const sortOptions = [
  { value: "default", label: "Default" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "reviews", label: "Most Reviewed" },
];

const priceRanges = [
  { label: "Under Tk 1000", min: 0, max: 999 },
  { label: "Tk 1000 - 2000", min: 1000, max: 2000 },
  { label: "Tk 2000 - 3000", min: 2000, max: 3000 },
  { label: "Above Tk 3000", min: 3001, max: Infinity },
];

const ratingOptions = [4, 3, 2];

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = decodeURIComponent(slug || "");

  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const meta = categoryMeta[category] || {
    title: category,
    description: `Browse our ${category} collection.`,
  };

  const hasActiveFilters = selectedPrice !== null || selectedRating !== null;

  const filteredProducts = useMemo(() => {
    let results = products.filter((p) => p.category === category);

    if (selectedPrice !== null) {
      const range = priceRanges[selectedPrice];
      results = results.filter((p) => p.price >= range.min && p.price <= range.max);
    }

    if (selectedRating !== null) {
      results = results.filter((p) => p.rating >= selectedRating);
    }

    if (sortBy === "price-low") results = [...results].sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") results = [...results].sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") results = [...results].sort((a, b) => b.rating - a.rating);
    else if (sortBy === "reviews") results = [...results].sort((a, b) => b.reviews - a.reviews);

    return results;
  }, [category, sortBy, selectedPrice, selectedRating]);

  const totalInCategory = useMemo(
    () => products.filter((p) => p.category === category).length,
    [category]
  );

  const clearFilters = () => {
    setSelectedPrice(null);
    setSelectedRating(null);
    setSortBy("default");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Category Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-border/40">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
          <div className="flex items-center gap-2 mb-3">
            <Link to="/" className="flex h-6 w-6 items-center justify-center rounded-full bg-background border border-border hover:border-primary/40 hover:text-primary transition-all shadow-sm">
              <ArrowLeft className="h-3 w-3" />
            </Link>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="h-2.5 w-2.5" />
              <span className="text-foreground font-medium">{meta.title}</span>
            </div>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">{meta.title}</h1>
          <p className="mt-1 text-xs text-muted-foreground max-w-xl">{meta.description}</p>
          <p className="mt-3 text-xs font-medium text-primary">
            {totalInCategory} {totalInCategory === 1 ? "product" : "products"}
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="container mx-auto px-4 py-8">
        {/* Filter & Sort Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
                showFilters || hasActiveFilters
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-foreground/70 hover:border-primary/40"
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
              {hasActiveFilters && (
                <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                  {(selectedPrice !== null ? 1 : 0) + (selectedRating !== null ? 1 : 0)}
                </span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
              >
                <X className="h-3 w-3" />
                Clear all
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
              {hasActiveFilters && ` of ${totalInCategory}`}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-border bg-background px-4 py-2 text-xs text-foreground outline-none focus:border-primary transition-colors"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mb-6 rounded-2xl border border-border/40 bg-muted/30 p-5 flex flex-wrap gap-8">
            <div>
              <p className="text-xs font-semibold text-foreground mb-2.5">Price Range</p>
              <div className="flex flex-wrap items-center gap-2">
                {priceRanges.map((range, idx) => (
                  <button
                    key={range.label}
                    onClick={() => setSelectedPrice(selectedPrice === idx ? null : idx)}
                    className={`rounded-full border px-3.5 py-1.5 text-[11px] font-medium transition-all ${
                      selectedPrice === idx
                        ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25"
                        : "border-border text-foreground/70 hover:border-primary/40"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground mb-2.5">Rating</p>
              <div className="flex items-center gap-2">
                {ratingOptions.map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRating(selectedRating === r ? null : r)}
                    className={`rounded-full border px-3.5 py-1.5 text-[11px] font-medium transition-all ${
                      selectedRating === r
                        ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25"
                        : "border-border text-foreground/70 hover:border-primary/40"
                    }`}
                  >
                    {r}+ Stars
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-base font-semibold text-foreground">
              {hasActiveFilters ? "No matching products" : "No products yet"}
            </p>
            <p className="text-sm text-muted-foreground">
              {hasActiveFilters ? "Try adjusting your filters" : "Products for this category are coming soon!"}
            </p>
            {hasActiveFilters ? (
              <button onClick={clearFilters} className="mt-2 rounded-full border border-border px-5 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors">
                Clear Filters
              </button>
            ) : (
              <Link to="/" className="mt-2 rounded-full border border-border px-5 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors">
                Back to Home
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((p) => (
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
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CategoryPage;
