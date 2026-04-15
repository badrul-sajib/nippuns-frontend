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

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroBanner />
      <Categories />
      <LiveGallery />
      <DealOfTheDay />
      <NewArrivals />
      <LadiesBag />
      <SpecialOffers />
      <BestSeller />
      <RecentlyViewed />
      <Testimonials />
      <Showrooms />
      <Footer />
    </div>
  );
};

export default Index;
