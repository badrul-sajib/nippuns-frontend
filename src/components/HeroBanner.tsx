import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ShimmerImage from "@/components/ShimmerImage";
import { fetchHeroBanners } from "@/api/settings";
import heroMainBanner from "@/assets/hero-main-banner.png";
import heroLadiesOffer from "@/assets/hero-ladies-offer.png";
import heroMensOffer from "@/assets/hero-mens-offer.png";

interface HeroBanner {
  id: number;
  type: "main" | "side";
  image_url: string | null;
  alt_text: string | null;
  link_url: string | null;
}

interface HeroBannerData {
  main: HeroBanner | null;
  sides: HeroBanner[];
}

const FALLBACK: HeroBannerData = {
  main: { id: 0, type: "main", image_url: heroMainBanner, alt_text: "Featured offer", link_url: "/" },
  sides: [
    { id: 1, type: "side", image_url: heroLadiesOffer, alt_text: "Ladies collection", link_url: "/category/ladies-bag" },
    { id: 2, type: "side", image_url: heroMensOffer,   alt_text: "Men's collection",  link_url: "/category/mens-bag" },
  ],
};

const HeroBanner = () => {
  const [data, setData] = useState<HeroBannerData>(FALLBACK);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchHeroBanners()
      .then((res: HeroBannerData) => {
        if (cancelled) return;
        // Use API result only if it has anything; otherwise keep fallback
        if (res?.main || (res?.sides?.length ?? 0) > 0) {
          setData({
            main: res.main || null,
            sides: res.sides || [],
          });
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoaded(true); });
    return () => { cancelled = true; };
  }, []);

  // Hide entirely if no main and no sides after the API has responded
  if (loaded && !data.main && data.sides.length === 0) return null;

  const renderLink = (b: HeroBanner | null, className: string, eager = false) => {
    if (!b || !b.image_url) return null;
    const inner = (
      <ShimmerImage
        src={b.image_url}
        alt={b.alt_text || ""}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        shimmerClassName="w-full h-full"
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
    );
    const wrapper = `overflow-hidden rounded-2xl shadow-md shadow-primary/5 group block ${className}`;
    return b.link_url ? (
      <Link to={b.link_url} className={wrapper}>{inner}</Link>
    ) : (
      <div className={wrapper}>{inner}</div>
    );
  };

  return (
    <section className="container mx-auto px-3 sm:px-4 py-3 sm:py-5">
      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-[1fr_320px]">
        {renderLink(data.main, "shadow-lg shadow-primary/5", true)}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-1">
          {data.sides.map((b) => (
            <div key={b.id}>{renderLink(b, "")}</div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
