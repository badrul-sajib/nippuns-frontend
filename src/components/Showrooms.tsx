import { MapPin, ExternalLink } from "lucide-react";

const showrooms = [
  {
    name: "Showroom- 01",
    address: "Police Plaza, 3rd floor, Shop No: 440, Gulshan-1, Dhaka-1212",
    hours: "Open: 10 AM – 9 PM",
  },
  {
    name: "Showroom- 02",
    address: "Police Plaza, 3rd floor, Shop No: 440, Gulshan-1, Dhaka-1212",
    hours: "Open: 10 AM – 9 PM",
  },
];

const Showrooms = () => {
  return (
    <section className="container mx-auto px-3 sm:px-4 py-6 sm:py-10">
      <h2 className="mb-4 sm:mb-6 text-base sm:text-lg font-bold text-foreground">Visit Our Showrooms</h2>
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        {showrooms.map((s, i) => (
          <div key={i} className="group flex flex-col sm:flex-row overflow-hidden rounded-xl sm:rounded-2xl border border-border/40 bg-card transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
            {/* Map placeholder */}
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
              <p className="mt-1 text-[11px] text-muted-foreground/70">{s.hours}</p>
              <a href="#" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors group/link">
                View On Google Maps
                <ExternalLink className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Showrooms;
