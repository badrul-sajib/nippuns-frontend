import { Link } from "react-router-dom";
import ShimmerImage from "@/components/ShimmerImage";
import heroMainBanner from "@/assets/hero-main-banner.png";
import heroLadiesOffer from "@/assets/hero-ladies-offer.png";
import heroMensOffer from "@/assets/hero-mens-offer.png";

const HeroBanner = () => {
  const sideData = [
    { src: heroLadiesOffer, alt: "Limited Time Offer on Ladies Items - 20% OFF", link: "/category/ladies-bag" },
    { src: heroMensOffer, alt: "Limited Time Offer Men's Collection - Save 20%", link: "/category/mens-bag" },
  ];

  return (
    <section className="container mx-auto px-3 sm:px-4 py-3 sm:py-5">
      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-[1fr_320px]">
        <Link to="/category/deals" className="overflow-hidden rounded-2xl shadow-lg shadow-primary/5 group block">
          <ShimmerImage
            src={heroMainBanner}
            alt="Create Your Custom Bundle - 20% OFF"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            shimmerClassName="w-full h-full"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </Link>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-1">
          {sideData.map((banner, i) => (
            <Link key={i} to={banner.link} className="overflow-hidden rounded-2xl shadow-md shadow-primary/5 group cursor-pointer block">
              <ShimmerImage
                src={banner.src}
                alt={banner.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                shimmerClassName="w-full h-full"
                loading="eager"
                decoding="async"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
