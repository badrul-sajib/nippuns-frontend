import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { fetchSettings } from "@/api/settings";

export interface FooterFeature {
  icon: string;
  label: string;
  sub: string;
}

export interface FooterMenuLink {
  label: string;
  url: string;
}

export interface FooterMenu {
  title: string;
  links: FooterMenuLink[];
}

export interface KnownSettings {
  // General
  site_name: string;
  site_tagline: string;
  site_email: string;
  site_phone: string;
  site_address: string;
  site_logo: string;
  currency: string;
  currency_symbol: string;
  timezone: string;
  // Order
  min_order_amount: number;
  advance_payment_required: boolean;
  // Payment
  bkash_merchant_number: string;
  nagad_merchant_number: string;
  rocket_merchant_number: string;
  // Social
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  twitter_url: string;
  whatsapp_number: string;
  whatsapp_message: string;
  // Footer
  footer_description: string;
  footer_hotline: string;
  footer_copyright: string;
  footer_features: FooterFeature[];
  footer_menus: FooterMenu[];
  footer_payment_badges: string[];
  // Sections
  section_special_offers_title: string;
  section_special_offers_subtitle: string;
  section_best_seller_title: string;
  section_best_seller_subtitle: string;
  section_new_arrivals_title: string;
  section_new_arrivals_subtitle: string;
  section_deal_of_the_day_title: string;
  section_deal_of_the_day_subtitle: string;
  section_live_gallery_title: string;
  section_showrooms_title: string;
  section_testimonials_title: string;
  section_testimonials_subtitle: string;
  featured_category_slug: string;
  featured_category_title: string;
}

const DEFAULT_SETTINGS: KnownSettings = {
  site_name: "Nipun's Gallery",
  site_tagline: "Your Premium Bag Store",
  site_email: "info@nipunsgallery.com",
  site_phone: "01700000000",
  site_address: "Dhaka, Bangladesh",
  site_logo: "",
  currency: "BDT",
  currency_symbol: "৳",
  timezone: "Asia/Dhaka",
  min_order_amount: 0,
  advance_payment_required: false,
  bkash_merchant_number: "",
  nagad_merchant_number: "",
  rocket_merchant_number: "",
  facebook_url: "",
  instagram_url: "",
  youtube_url: "",
  twitter_url: "",
  whatsapp_number: "",
  whatsapp_message: "Hi! I need help with my order.",
  footer_description: "Your one-stop destination for premium bags, accessories & more.",
  footer_hotline: "",
  footer_copyright: "© Nipun's Gallery. All Rights Reserved.",
  footer_features: [],
  footer_menus: [],
  footer_payment_badges: [],
  section_special_offers_title: "Special Offers",
  section_special_offers_subtitle: "Biggest discounts across the store",
  section_best_seller_title: "Best Seller",
  section_best_seller_subtitle: "",
  section_new_arrivals_title: "New Arrivals",
  section_new_arrivals_subtitle: "Fresh additions across all categories",
  section_deal_of_the_day_title: "Shop From Deal Of The Day",
  section_deal_of_the_day_subtitle: "Choose Your Style, According To Your Comfy",
  section_live_gallery_title: "Nipun's Gallery All Live",
  section_showrooms_title: "Visit Our Showrooms",
  section_testimonials_title: "What Our Customers Are Saying",
  section_testimonials_subtitle: "Trusted by thousands of happy customers",
  featured_category_slug: "ladies-bag",
  featured_category_title: "Ladies Bag",
};

interface SettingsContextValue {
  settings: KnownSettings;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  loading: false,
});

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<KnownSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchSettings()
      .then((data: Partial<KnownSettings>) => {
        if (cancelled) return;
        setSettings((prev) => ({ ...prev, ...data }));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
