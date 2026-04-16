import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, ExternalLink, ArrowRight } from "lucide-react";
import ShimmerImage from "@/components/ShimmerImage";
import { Link } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/contexts/SettingsContext";
import { fetchLiveGallery } from "@/api/settings";

interface LiveGalleryItem {
  id: number;
  title: string;
  image_url: string | null;
  is_live: boolean;
  scheduled_at: string | null;
  external_url: string | null;
}

const formatDate = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).toUpperCase();
};

const LiveGallery = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { settings } = useSettings();
  const [items, setItems] = useState<LiveGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<LiveGalleryItem | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchLiveGallery()
      .then((data: LiveGalleryItem[]) => {
        if (cancelled) return;
        setItems(Array.isArray(data) ? data : []);
      })
      .catch(() => setItems([]))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  if (!loading && items.length === 0) return null;

  return (
    <section className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <div className="mb-4 sm:mb-6 flex items-center justify-between">
        <h2 className="text-sm sm:text-lg font-semibold text-foreground">{settings.section_live_gallery_title}</h2>
        <Link to="/category/live-gallery" className="flex items-center gap-1 rounded-full border border-border px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-foreground/70 hover:border-primary/40 hover:text-primary transition-all">
          View All <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </Link>
      </div>
      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm text-primary shadow-md border border-border/40 hover:bg-background transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div ref={scrollRef} className="flex gap-3 sm:gap-4 overflow-x-auto px-2 pb-2 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="relative min-w-[160px] sm:min-w-[210px] flex-shrink-0 overflow-hidden rounded-xl sm:rounded-2xl h-56 sm:h-72 w-40 sm:w-52 cursor-pointer group shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              {item.image_url && (
                <ShimmerImage
                  src={item.image_url}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  shimmerClassName="h-full w-full"
                  loading="lazy"
                  decoding="async"
                  width={210}
                  height={288}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              {item.is_live && (
                <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-destructive px-3 py-1 text-[11px] font-bold text-primary-foreground shadow-lg">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground animate-pulse" />
                  Live
                </span>
              )}

              {item.scheduled_at && !item.is_live && (
                <span className="absolute right-3 top-3 rounded-full bg-foreground/40 px-2.5 py-1 text-[10px] font-medium text-primary-foreground backdrop-blur-md">
                  {formatDate(item.scheduled_at)}
                </span>
              )}

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/60 backdrop-blur-sm shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-primary-foreground/80">
                  <Play className="h-5 w-5 text-foreground/80 ml-0.5" fill="currentColor" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex items-center justify-center gap-1.5 rounded-full bg-primary py-2 text-xs font-semibold text-primary-foreground shadow-lg">
                  <ExternalLink className="h-3.5 w-3.5" />
                  {item.is_live ? "Watch Live" : "View Live"}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 active:scale-95"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden border-0 rounded-2xl">
          {selectedItem && (
            <div className="relative">
              {selectedItem.image_url && (
                <img
                  src={selectedItem.image_url}
                  alt={selectedItem.title}
                  className="w-full h-[450px] object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

              {selectedItem.is_live && (
                <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-destructive px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-lg">
                  <span className="h-2 w-2 rounded-full bg-primary-foreground animate-pulse" />
                  LIVE NOW
                </span>
              )}

              {selectedItem.scheduled_at && !selectedItem.is_live && (
                <span className="absolute right-4 top-4 rounded-full bg-foreground/40 px-3 py-1.5 text-xs font-medium text-primary-foreground backdrop-blur-md">
                  {formatDate(selectedItem.scheduled_at)}
                </span>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-lg font-bold text-primary-foreground mb-3">{selectedItem.title}</h3>
                {selectedItem.external_url && (
                  <a href={selectedItem.external_url} target="_blank" rel="noopener noreferrer">
                    <Button className="rounded-full shadow-md shadow-primary/30 text-xs font-semibold">
                      {selectedItem.is_live ? "Join Live Stream" : "Watch Replay"}
                    </Button>
                  </a>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default LiveGallery;
