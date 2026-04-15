import api from './client';

export const fetchProducts = (params?: {
  search?: string; category?: string; sort?: string;
  featured?: boolean; new_arrivals?: boolean; page?: number;
}) => api.get('/products', { params }).then(r => r.data);

export const fetchProduct = (id: string) =>
  api.get(`/products/${id}`).then(r => r.data);

export const fetchFeatured = () =>
  api.get('/products/featured').then(r => r.data);

export const fetchNewArrivals = () =>
  api.get('/products/new-arrivals').then(r => r.data);

export const searchProducts = (q: string, category?: string, sort?: string) =>
  api.get('/products/search', { params: { q, category, sort } }).then(r => r.data);

export const fetchProductReviews = (productId: string) =>
  api.get(`/products/${productId}/reviews`).then(r => r.data);
