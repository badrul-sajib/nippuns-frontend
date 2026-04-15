export interface Product {
  id: string;
  name: string;
  brand: string;
  code: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviews: number;
  reviewCount: number;
  description: string;
  images: string[];
  colors: { name: string; value: string }[];
  sizes: string[];
  inStock: boolean;
  category: string;
  categorySlug: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  advanceAmount?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  products_count?: number;
}

export interface Outlet {
  id: number;
  name: string;
  address: string;
  phone?: string;
  hours?: string;
  map_url?: string;
}
