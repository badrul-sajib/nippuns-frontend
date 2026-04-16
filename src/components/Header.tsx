import { Search, Heart, ShoppingCart, User, Menu, Package, LogOut } from "lucide-react";
import logoImg from "@/assets/Logo.png";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";

import { searchProducts as apiSearchProducts } from "@/api/products";
import { fetchCategories } from "@/api/categories";
import type { Product, Category } from "@/types/product";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState(() => {
    const match = location.pathname.match(/^\/category\/(.+)/);
    return match ? decodeURIComponent(match[1]) : "";
  });

  // Fetch categories from API
  useEffect(() => {
    let cancelled = false;
    fetchCategories()
      .then((data) => {
        if (cancelled) return;
        const items: Category[] = data?.data || data || [];
        setCategories(items.filter((c) => (c.products_count ?? (c as any).productCount ?? 1) > 0));
      })
      .catch(() => setCategories([]));
    return () => { cancelled = true; };
  }, []);

  // Sync active category from URL
  useEffect(() => {
    const match = location.pathname.match(/^\/category\/(.+)/);
    setActiveCategory(match ? decodeURIComponent(match[1]) : "");
  }, [location.pathname]);
  const { isAuthenticated: isLoggedIn, logout } = useAuth();
  const { settings } = useSettings();
  const { totalItems, setIsOpen } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const searchRef = useRef<HTMLDivElement>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const [searchResults, setSearchResults] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;
    if (!debouncedQuery.trim()) {
      setSearchResults([]);
      return;
    }
    apiSearchProducts(debouncedQuery)
      .then((data) => {
        if (cancelled) return;
        const items: Product[] = data?.data || data || [];
        setSearchResults(items.slice(0, 6));
      })
      .catch(() => setSearchResults([]));
    return () => { cancelled = true; };
  }, [debouncedQuery]);

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

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md">
      {/* Top Bar */}
      <div className="bg-primary">
        <div className="container mx-auto flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 py-2.5 sm:py-3.5">
          {/* Left: Logo */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            <Link to="/" className="flex items-center flex-shrink-0">
              <img src={settings.site_logo || logoImg} alt={settings.site_name} className="h-8 sm:h-10 w-auto" />
            </Link>
          </div>

          {/* Center: Search (desktop only) */}
          <div className="mx-8 hidden max-w-xl flex-1 md:flex" ref={searchRef}>
            <form
              className="relative w-full"
              onSubmit={(e) => {
                e.preventDefault();
                setShowDropdown(false);
                if (searchQuery.trim()) {
                  navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
            >
              <div className="flex items-center rounded-full bg-primary-foreground overflow-hidden shadow-lg shadow-primary/20">
                <input
                  placeholder="Search product ..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                  className="flex-1 bg-transparent px-5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
                <button type="submit" className="flex items-center gap-1.5 rounded-full bg-primary m-1 px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all active:scale-95">
                  Search
                </button>
              </div>

              {/* Ajax Search Dropdown */}
              {showDropdown && debouncedQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-border bg-card shadow-xl z-50 overflow-hidden">
                  {searchResults.length > 0 ? (
                    <>
                      <ul>
                        {searchResults.map((product) => (
                          <li key={product.id}>
                            <Link
                              to={`/product/${product.id}`}
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
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link
                        to={`/search?q=${encodeURIComponent(debouncedQuery.trim())}`}
                        className="block border-t border-border px-4 py-2.5 text-center text-xs font-semibold text-primary hover:bg-accent transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        View all results →
                      </Link>
                    </>
                  ) : (
                    <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                      No products found for "{debouncedQuery}"
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Right: Search(mobile) + Cart + User */}
          <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
            <Link to="/search" className="flex h-9 w-9 items-center justify-center rounded-lg text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-all md:hidden">
              <Search className="h-[22px] w-[22px]" />
            </Link>
            <Link to="/orders" className="hidden md:flex items-center gap-1.5 rounded-full border border-primary-foreground/30 px-3 py-1.5 text-primary-foreground/90 hover:text-primary-foreground hover:border-primary-foreground/60 transition-all">
              <Package className="h-4 w-4" />
              <span className="text-xs font-medium">Track</span>
            </Link>
            <Link to="/wishlist" className="flex h-9 w-9 items-center justify-center rounded-lg text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-all relative">
              <Heart className="h-[22px] w-[22px]" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[16px] w-[16px] items-center justify-center rounded-full bg-primary-foreground text-[8px] font-bold text-primary">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(true)} className="relative flex h-9 w-9 items-center justify-center rounded-lg text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-all">
              <ShoppingCart className="h-[22px] w-[22px]" />
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-primary-foreground text-[9px] font-bold text-primary">
                {totalItems}
              </span>
            </button>
            <Link to={isLoggedIn ? "/dashboard" : "/auth"} className="flex h-9 w-9 items-center justify-center rounded-lg text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-all" title={isLoggedIn ? "My Dashboard" : "Login"}>
              <User className="h-5 w-5" />
            </Link>
            {isLoggedIn && (
              <button onClick={handleLogout} className="hidden md:flex h-9 w-9 items-center justify-center rounded-lg text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-all" title="Logout">
                <LogOut className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Navigation - horizontal scroll on mobile, centered on desktop */}
      <nav className="border-b border-border/60 bg-background">
        <div className="container mx-auto px-3 sm:px-6">
          <ul className="flex items-center md:justify-center overflow-x-auto scrollbar-hide gap-0">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.slug;
              return (
                <li key={cat.id} className="flex-shrink-0">
                  <button
                    onClick={() => { setActiveCategory(cat.slug); navigate(`/category/${cat.slug}`); }}
                    className={`relative whitespace-nowrap px-4 md:px-5 py-2.5 md:py-3 text-[12px] md:text-[13px] font-medium transition-all duration-300 ${
                      isActive
                        ? "text-primary scale-105"
                        : "text-foreground/60 hover:text-foreground hover:scale-105"
                    }`}
                  >
                    {cat.name}
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2.5px] rounded-full bg-primary transition-all duration-300 ${
                      isActive ? "w-full scale-x-100 origin-center" : "w-full scale-x-0 origin-center"
                    }`} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
