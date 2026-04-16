import { useState, useMemo, useRef, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search as SearchIcon, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { searchProducts as apiSearchProducts } from "@/api/products";
import { fetchCategories } from "@/api/categories";
import type { Product, Category } from "@/types/product";


const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "reviews", label: "Most Reviewed" },
];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("cat") || "All";

  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);

  // Sync from URL changes (e.g. header category click)
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const cat = searchParams.get("cat") || "All";
    setQuery(q);
    if (cat !== "All") setActiveCategory(cat);
  }, [searchParams]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  const [results, setResults] = useState<Product[]>([]);
  const [ajaxResults, setAjaxResults] = useState<Product[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);

  // Debounce for ajax dropdown
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch categories on mount
  useEffect(() => {
    let cancelled = false;
    fetchCategories()
      .then((data) => {
        if (cancelled) return;
        const items: Category[] = data?.data || data || [];
        setAllCategories(items.map((c) => c.name).filter(Boolean));
      })
      .catch(() => setAllCategories([]));
    return () => { cancelled = true; };
  }, []);

  // Fetch ajax dropdown results
  useEffect(() => {
    let cancelled = false;
    if (!debouncedQuery.trim()) {
      setAjaxResults([]);
      return;
    }
    apiSearchProducts(debouncedQuery)
      .then((data) => {
        if (cancelled) return;
        const items: Product[] = data?.data || data || [];
        setAjaxResults(items.slice(0, 6));
      })
      .catch(() => setAjaxResults([]));
    return () => { cancelled = true; };
  }, [debouncedQuery]);

  // Fetch full search results
  useEffect(() => {
    let cancelled = false;
    setLoadingResults(true);
    apiSearchProducts(
      query,
      activeCategory !== "All" ? activeCategory : undefined,
      sortBy !== "relevance" ? sortBy : undefined
    )
      .then((data) => {
        if (cancelled) return;
        const items: Product[] = data?.data || data || [];
        setResults(items);
      })
      .catch(() => setResults([]))
      .finally(() => { if (!cancelled) setLoadingResults(false); });
    return () => { cancelled = true; };
  }, [query, activeCategory, sortBy]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const updateParams = (q: string, cat: string) => {
    const params: Record<string, string> = {};
    if (q) params.q = q;
    if (cat && cat !== "All") params.cat = cat;
    setSearchParams(params);
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setShowDropdown(true);
    updateParams(value, activeCategory);
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    updateParams(query, cat);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Search</span>
          {query && (
            <>
              <span>/</span>
              <span className="text-foreground font-medium">"{query}"</span>
            </>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-8" ref={searchRef}>
          <div className="relative max-w-2xl">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onFocus={() => query.trim() && setShowDropdown(true)}
              placeholder="Search for bags, jewellery, accessories..."
              className="w-full rounded-2xl border border-border bg-background pl-12 pr-12 py-3.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              autoFocus
            />
            {query && (
              <button
                onClick={() => { handleQueryChange(""); setShowDropdown(false); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-foreground hover:text-background transition-all"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            {/* Ajax Search Dropdown */}
            {showDropdown && debouncedQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-border bg-card shadow-xl z-50 overflow-hidden">
                {ajaxResults.length > 0 ? (
                  <>
                    <ul>
                      {ajaxResults.map((product) => (
                        <li key={product.id}>
                          <a
                            href={`/product/${product.id}`}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors"
                            onClick={() => setShowDropdown(false)}
                          >
                            <img
                              src={product.images?.[0]}
                              alt={product.name}
                              className="h-10 w-10 rounded-lg object-cover bg-muted"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                              <p className="text-xs text-muted-foreground">{product.brand} · {product.category}</p>
                            </div>
                            <span className="text-sm font-semibold text-primary whitespace-nowrap">Tk {product.price}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                    No products found for "{debouncedQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Filters Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
                showFilters ? "border-primary bg-primary/5 text-primary" : "border-border text-foreground/70 hover:border-primary/40"
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
            </button>

            {/* Category pills */}
            <button
              onClick={() => handleCategoryChange("All")}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                activeCategory === "All"
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "border border-border bg-background text-foreground/70 hover:border-primary/40"
              }`}
            >
              All
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "border border-border bg-background text-foreground/70 hover:border-primary/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
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

        {/* Price Range Filter (shown when filters toggled) */}
        {showFilters && (
          <div className="mb-6 rounded-2xl border border-border/40 bg-muted/30 p-5 flex flex-wrap gap-6">
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">Price Range</p>
              <div className="flex items-center gap-2">
                {["Under 1000", "1000-2000", "2000-3000", "Above 3000"].map((range) => (
                  <button key={range} className="rounded-full border border-border px-3 py-1 text-[11px] text-foreground/70 hover:border-primary/40 transition-colors">
                    Tk {range}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">Rating</p>
              <div className="flex items-center gap-2">
                {[4, 3, 2].map((r) => (
                  <button key={r} className="rounded-full border border-border px-3 py-1 text-[11px] text-foreground/70 hover:border-primary/40 transition-colors">
                    {r}+ Stars
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {results.length} {results.length === 1 ? "product" : "products"} found
            {query && <span> for "<span className="font-medium text-foreground">{query}</span>"</span>}
          </p>
        </div>

        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <SearchIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-foreground">
                {query ? "No products found" : "Search for your favourite bags"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {query ? "Try a different search term or category" : "Type a keyword above to explore our collection"}
              </p>
            </div>
            {query && (
              <Button variant="outline" className="rounded-full mt-2" onClick={() => { handleQueryChange(""); handleCategoryChange("All"); }}>
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {results.map((p) => (
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
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SearchPage;
