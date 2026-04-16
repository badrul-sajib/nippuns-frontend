import { Truck, RotateCcw, Shield, Headphones, Facebook, Instagram, Youtube, Twitter, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import logoImg from "@/assets/Logo.png";
import { useSettings } from "@/contexts/SettingsContext";

const iconMap: Record<string, LucideIcon> = {
  truck: Truck,
  return: RotateCcw,
  shield: Shield,
  headphones: Headphones,
};

const Footer = () => {
  const { settings } = useSettings();

  const socialLinks = [
    { Icon: Facebook, url: settings.facebook_url },
    { Icon: Instagram, url: settings.instagram_url },
    { Icon: Youtube, url: settings.youtube_url },
    { Icon: Twitter, url: settings.twitter_url },
  ].filter((s) => !!s.url);

  return (
    <footer className="mt-8 bg-foreground text-background">
      {settings.footer_features.length > 0 && (
        <div className="border-b border-background/10">
          <div className="container mx-auto px-3 sm:px-4 py-5 sm:py-8">
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
              {settings.footer_features.map((f, i) => {
                const Icon = iconMap[f.icon] || Truck;
                return (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/20 transition-colors group-hover:bg-primary/30">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold tracking-wider text-background">{f.label}</span>
                      <span className="block text-[10px] text-background/50">{f.sub}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <img src={settings.site_logo || logoImg} alt={settings.site_name} className="h-10 w-auto" />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-background/50">{settings.footer_description}</p>
            <div className="mt-4 space-y-1.5">
              {settings.footer_hotline && (
                <p className="text-xs text-background/70"><span className="font-semibold">HOTLINE:</span> {settings.footer_hotline}</p>
              )}
              {settings.site_email && (
                <p className="text-xs text-background/70"><span className="font-semibold">Email:</span> {settings.site_email}</p>
              )}
            </div>
            {socialLinks.length > 0 && (
              <div className="mt-5 flex gap-2">
                {socialLinks.map(({ Icon, url }, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg bg-background/10 text-background/60 hover:bg-primary hover:text-primary-foreground transition-all">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {settings.footer_menus.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-bold text-background">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.url.startsWith("/") ? (
                      <Link to={link.url} className="text-xs text-background/50 transition-colors hover:text-primary">{link.label}</Link>
                    ) : (
                      <a href={link.url} className="text-xs text-background/50 transition-colors hover:text-primary">{link.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="container mx-auto flex flex-wrap items-center justify-center sm:justify-between gap-3 sm:gap-4 px-3 sm:px-4 py-4 sm:py-5">
          <p className="text-xs text-background/40">{settings.footer_copyright}</p>
          {settings.footer_payment_badges.length > 0 && (
            <div className="flex gap-2">
              {settings.footer_payment_badges.map((p) => (
                <span key={p} className="rounded-lg bg-background/10 px-3 py-1.5 text-[10px] font-semibold text-background/60">{p}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
