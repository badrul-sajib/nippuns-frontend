import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import {
  fetchWishlist as apiFetchWishlist,
  addToWishlist as apiAddToWishlist,
  removeFromWishlist as apiRemoveFromWishlist,
} from "@/api/wishlist";

export interface WishlistItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: WishlistItem) => void;
  isInWishlist: (id: string) => boolean;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = "nipuns-wishlist";

const loadFromStorage = (): WishlistItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const isLoggedIn = () => !!localStorage.getItem("auth_token");

// Normalize API wishlist item to WishlistItem shape
const normalizeApiItem = (apiItem: any): WishlistItem | null => {
  const product = apiItem.product || apiItem;
  if (!product || !product.id) return null;
  return {
    id: String(product.id),
    name: product.name || "",
    brand: product.brand || "",
    price: Number(product.price) || 0,
    originalPrice: Number(product.originalPrice || product.original_price || product.price) || 0,
    image: Array.isArray(product.images) ? product.images[0] : (product.image || ""),
    rating: Number(product.rating) || 0,
    reviews: Number(product.reviews || product.reviewCount || product.review_count) || 0,
  };
};

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<WishlistItem[]>(loadFromStorage);
  const [synced, setSynced] = useState(false);

  // Sync with API on mount if logged in
  useEffect(() => {
    if (!isLoggedIn() || synced) return;
    apiFetchWishlist()
      .then((data) => {
        const apiItems: WishlistItem[] = (data.data || data || [])
          .map(normalizeApiItem)
          .filter((i: WishlistItem | null): i is WishlistItem => i !== null);
        // Merge: API is source of truth when logged in
        setItems(apiItems);
        setSynced(true);
      })
      .catch(() => {
        // Fall back to localStorage if API fails
        setSynced(true);
      });
  }, [synced]);

  // Persist to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: WishlistItem) => {
    setItems((prev) => (prev.some((i) => i.id === item.id) ? prev : [...prev, item]));
    if (isLoggedIn()) {
      apiAddToWishlist(item.id).catch(() => {});
    }
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (isLoggedIn()) {
      apiRemoveFromWishlist(id).catch(() => {});
    }
  }, []);

  const toggleItem = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      if (exists) {
        if (isLoggedIn()) apiRemoveFromWishlist(item.id).catch(() => {});
        return prev.filter((i) => i.id !== item.id);
      } else {
        if (isLoggedIn()) apiAddToWishlist(item.id).catch(() => {});
        return [...prev, item];
      }
    });
  }, []);

  const isInWishlist = useCallback((id: string) => items.some((i) => i.id === id), [items]);

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, toggleItem, isInWishlist, totalItems: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
};
