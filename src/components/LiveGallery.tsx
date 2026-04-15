import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, X, ExternalLink, ArrowRight } from "lucide-react";
import ShimmerImage from "@/components/ShimmerImage";
import { Link } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import live1 from "@/assets/live-1.jpg";
import live2 from "@/assets/live-2.jpg";
import live3 from "@/assets/live-3.jpg";
import live4 from "@/assets/live-4.jpg";
import live5 from "@/assets/live-5.jpg";

const galleryItems = [
  { id: 1, image: live1, isLive: true, date: "", title: "Live Now — New Arrivals" },
  { id: 2, image: live2, isLive: false, date: "JUNE 24, 2024 | 7PM", title: "Leopard Print Collection" },
  { id: 3, image: live3, isLive: false, date: "JUNE 24, 2024 | 7PM", title: "White Elegance Series" },
  { id: 4, image: live4, isLive: false, date: "JUNE 24, 2024 | 7PM", title: "Croc Leather Premium" },
  { id: 5, image: live5, isLive: false, date: "JUNE 24, 2024 | 7PM", title: "Hermès Inspired Box" },
  { id: 6, image: live3, isLive: true, date: "", title: "Live — Summer Sale Picks" },
  { id: 7, image: live1, isLive: false, date: "JUNE 25, 2024 | 8PM", title: "Crossbody Bag Showcase" },
  { id: 8, image: live4, isLive: false, date: "JUNE 26, 2024 | 7PM", title: "Office Bag Essentials" },
  { id: 9, image: live2, isLive: false, date: "JUNE 27, 2024 | 6PM", title: "Tote Bag Favorites" },
  { id: 10, image: live5, isLive: false, date: "JUNE 28, 2024 | 7PM", title: "Weekend Travel Must-Haves" },
];

const LiveGallery = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<typeof galleryItems[0] | null>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  return (
    <section className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <div className="mb-4 sm:mb-6 flex items-center justify-between">
        <h2 className="text-sm sm:text-lg font-semibold text-foreground">Nipun's Gallery All Live</h2>
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
          {galleryItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="relative min-w-[160px] sm:min-w-[210px] flex-shrink-0 overflow-hidden rounded-xl sm:rounded-2xl h-56 sm:h-72 w-40 sm:w-52 cursor-pointer group shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <ShimmerImage
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                shimmerClassName="h-full w-full"
                loading="lazy"
                decoding="async"
                width={210}
                height={288}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              {item.isLive && (
                <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-destructive px-3 py-1 text-[11px] font-bold text-primary-foreground shadow-lg">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground animate-pulse" />
                  Live
                </span>
              )}

              {item.date && (
                <span className="absolute right-3 top-3 rounded-full bg-foreground/40 px-2.5 py-1 text-[10px] font-medium text-primary-foreground backdrop-blur-md">
                  {item.date}
                </span>
              )}

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/60 backdrop-blur-sm shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-primary-foreground/80">
                  <Play className="h-5 w-5 text-foreground/80 ml-0.5" fill="currentColor" />
                </div>
              </div>

              {/* View Live overlay on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex items-center justify-center gap-1.5 rounded-full bg-primary py-2 text-xs font-semibold text-primary-foreground shadow-lg">
                  <ExternalLink className="h-3.5 w-3.5" />
                  {item.isLive ? "Watch Live" : "View Live"}
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

      {/* View Live Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden border-0 rounded-2xl">
          {selectedItem && (
            <div className="relative">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="w-full h-[450px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

              {selectedItem.isLive && (
                <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-destructive px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-lg">
                  <span className="h-2 w-2 rounded-full bg-primary-foreground animate-pulse" />
                  LIVE NOW
                </span>
              )}

              {selectedItem.date && (
                <span className="absolute right-4 top-4 rounded-full bg-foreground/40 px-3 py-1.5 text-xs font-medium text-primary-foreground backdrop-blur-md">
                  {selectedItem.date}
                </span>
              )}

              <div className="absolute inset-0 flex items-center justify-center">
                <button className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground/80 shadow-xl transition-transform hover:scale-110 active:scale-95">
                  <Play className="h-7 w-7 text-foreground ml-0.5" fill="currentColor" />
                </button>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-lg font-bold text-primary-foreground mb-3">{selectedItem.title}</h3>
                <Button className="rounded-full shadow-md shadow-primary/30 text-xs font-semibold">
                  {selectedItem.isLive ? "Join Live Stream" : "Watch Replay"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default LiveGallery;
