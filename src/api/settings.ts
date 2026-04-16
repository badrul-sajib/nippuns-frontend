import api from './client';

export const fetchSettings = () =>
  api.get('/settings').then((r) => r.data?.data || r.data || {});

export const fetchHeroBanners = () =>
  api.get('/hero-banners').then((r) => r.data?.data || r.data || { main: null, sides: [] });

export const fetchTestimonials = () =>
  api.get('/testimonials').then((r) => r.data?.data || r.data || []);

export const fetchLiveGallery = () =>
  api.get('/live-gallery').then((r) => r.data?.data || r.data || []);
