import { useEffect, useState } from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { fetchOutlets } from "@/api/outlets";

interface Outlet {
  id: number;
  name: string;
  address: string;
  city?: string;
  phone?: string;
  google_maps_url?: string | null;
  opening_time?: string | null;
  closing_time?: string | null;
  hours_display?: string | null;
}

const formatHours = (o: Outlet) => {
  if (o.hours_display) return o.hours_display;
  if (o.opening_time && o.closing_time) {
    const fmt = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      const ampm = h >= 12 ? "PM" : "AM";
      const hh = ((h + 11) % 12) + 1;
      return `${hh}${m ? `:${String(m).padStart(2, "0")}` : ""} ${ampm}`;
    };
    return `Open: ${fmt(o.opening_time)} – ${fmt(o.closing_time)}`;
  }
  return "";
};

const SkeletonCard = () => (
  <div className="flex flex-col sm:flex-row overflow-hidden rounded-xl sm:rounded-2xl border border-border/40 bg-card animate-pulse">
    <div className="h-36 sm:h-52 sm:w-2/5 bg-muted/50" />
    <div className="flex flex-1 flex-col justify-center p-6 space-y-2">
      <div className="h-3 w-1/3 rounded bg-muted/60" />
      <div className="h-5 w-1/2 rounded bg-muted/60" />
      <div className="h-3 w-3/4 rounded bg-muted/60" />
    </div>
  </div>
);

const Showrooms = () => {
  const { settings } = useSettings();
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchOutlets()
      .then((data) => {
        if (cancelled) return;
        const items: Outlet[] = data?.data || data || [];
        setOutlets(Array.isArray(items) ? items : []);
      })
      .catch(() => setOutlets([]))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (!loading && outlets.length === 0) return null;

  return (
    <section className="container mx-auto px-3 sm:px-4 py-6 sm:py-10">
      <h2 className="mb-4 sm:mb-6 text-base sm:text-lg font-bold text-foreground">{settings.section_showrooms_title}</h2>
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        {loading
          ? Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)
          : outlets.map((s) => (
              <div key={s.id} className="group flex flex-col sm:flex-row overflow-hidden rounded-xl sm:rounded-2xl border border-border/40 bg-card transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                <div className="flex h-36 sm:h-52 sm:w-2/5 items-center justify-center bg-gradient-to-br from-accent to-secondary/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDAsMCwwLDAuMDUpIi8+PC9zdmc+')] opacity-50" />
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 backdrop-blur-sm">
                    <MapPin className="h-7 w-7 text-primary" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-center p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">Visit Our</p>
                  <h3 className="mt-1 text-xl font-bold text-foreground">{s.name}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{s.address}</p>
                  {formatHours(s) && (
                    <p className="mt-1 text-[11px] text-muted-foreground/70">{formatHours(s)}</p>
                  )}
                  {s.google_maps_url && (
                    <a href={s.google_maps_url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors group/link">
                      View On Google Maps
                      <ExternalLink className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
      </div>
    </section>
  );
};

export default Showrooms;
