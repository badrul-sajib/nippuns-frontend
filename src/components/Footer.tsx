import { Truck, RotateCcw, Shield, Headphones, Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import logoImg from "@/assets/Logo.png";

const features = [
  { icon: Truck, label: "FREE SHIPPING", sub: "Over 3000TK" },
  { icon: RotateCcw, label: "30 DAYS RETURN", sub: "Money Back Guarantee" },
  { icon: Shield, label: "SECURE PAYMENT", sub: "100% Protected" },
  { icon: Headphones, label: "24/7 SUPPORT", sub: "Dedicated Service" },
];

const contact = {
  hotline: "0967821213",
  email: "nipunsgallery@gmail.com",
  description: "Your one-stop destination for premium bags, accessories & more.",
};

const social = { facebook: "https://facebook.com/nipunsgallery", instagram: "https://instagram.com/nipunsgallery", youtube: "https://youtube.com/@nipunsgallery", twitter: "https://twitter.com/nipunsgallery" };

const Footer = () => {
  return (
    <footer className="mt-8 bg-foreground text-background">
      <div className="border-b border-background/10">
        <div className="container mx-auto px-3 sm:px-4 py-5 sm:py-8">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/20 transition-colors group-hover:bg-primary/30">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <span className="block text-xs font-bold tracking-wider text-background">{f.label}</span>
                  <span className="block text-[10px] text-background/50">{f.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <img src={logoImg} alt="Nipun's Gallery" className="h-10 w-auto" />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-background/50">{contact.description}</p>
            <div className="mt-4 space-y-1.5">
              <p className="text-xs text-background/70"><span className="font-semibold">HOTLINE:</span> {contact.hotline}</p>
              <p className="text-xs text-background/70"><span className="font-semibold">Email:</span> {contact.email}</p>
            </div>
            <div className="mt-5 flex gap-2">
              {[
                { Icon: Facebook, url: social.facebook },
                { Icon: Instagram, url: social.instagram },
                { Icon: Youtube, url: social.youtube },
                { Icon: Twitter, url: social.twitter },
              ].map(({ Icon, url }, i) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg bg-background/10 text-background/60 hover:bg-primary hover:text-primary-foreground transition-all">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {[
            { title: "Explore More", links: ["Size Chart", "About Us", "Store Location", "FAQ", "Terms of Service", "Refund Policy"] },
            { title: "Top Categories", links: ["Ladies Bag", "Men's Bag", "Tote Bag", "School Bag", "Gym Bag", "Jewellery"] },
            { title: "Company", links: ["Contact", "Blog", "Terms & Conditions", "Track Order", "Careers"] },
            { title: "Help Center", links: ["Customer Service", "Policy", "My Account", "Product Support", "Shipping Info"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-bold text-background">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-xs text-background/50 transition-colors hover:text-primary">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="container mx-auto flex flex-wrap items-center justify-center sm:justify-between gap-3 sm:gap-4 px-3 sm:px-4 py-4 sm:py-5">
          <p className="text-xs text-background/40">© 2024 Nipun's Gallery. All Rights Reserved.</p>
          <div className="flex gap-2">
            {["VISA", "MC", "AMEX", "bKash", "COD"].map((p) => (
              <span key={p} className="rounded-lg bg-background/10 px-3 py-1.5 text-[10px] font-semibold text-background/60">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
