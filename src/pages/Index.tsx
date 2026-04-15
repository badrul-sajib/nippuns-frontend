import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import Categories from "@/components/Categories";
import LiveGallery from "@/components/LiveGallery";
import DealOfTheDay from "@/components/DealOfTheDay";
import NewArrivals from "@/components/NewArrivals";
import LadiesBag from "@/components/LadiesBag";
import SpecialOffers from "@/components/SpecialOffers";
import BestSeller from "@/components/BestSeller";
import Testimonials from "@/components/Testimonials";
import Showrooms from "@/components/Showrooms";
import RecentlyViewed from "@/components/RecentlyViewed";
import Footer from "@/components/Footer";
import { fetchFeatured, fetchNewArrivals } from "@/api/products";
import type { Product } from "@/types/product";

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivalProducts, setNewArrivalProducts] = useState<Product[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingNew, setLoadingNew] = useState(true);

  useEffect(() => {
    fetchFeatured()
      .then((data) => {
        const items = data.data || data || [];
        setFeaturedProducts(items);
      })
      .catch(() => {})
      .finally(() => setLoadingFeatured(false));
  }, []);

  useEffect(() => {
    fetchNewArrivals()
      .then((data) => {
        const items = data.data || data || [];
        setNewArrivalProducts(items);
      })
      .catch(() => {})
      .finally(() => setLoadingNew(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroBanner />
      <Categories />
      <LiveGallery />
      <DealOfTheDay products={featuredProducts} loading={loadingFeatured} />
      <NewArrivals products={newArrivalProducts} loading={loadingNew} />
      <LadiesBag />
      <SpecialOffers />
      <BestSeller products={featuredProducts} loading={loadingFeatured} />
      <RecentlyViewed />
      <Testimonials />
      <Showrooms />
      <Footer />
    </div>
  );
};

export default Index;
