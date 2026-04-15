import api from './client';
export const fetchWishlist = () => api.get('/wishlist').then(r => r.data);
export const addToWishlist = (productId: string) =>
  api.post('/wishlist', { product_id: productId }).then(r => r.data);
export const removeFromWishlist = (productId: string) =>
  api.delete(`/wishlist/${productId}`).then(r => r.data);
