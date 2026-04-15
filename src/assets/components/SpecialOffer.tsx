import { Percent } from "lucide-react";
import { Button } from "@/components/ui/button";

const SpecialOffer = () => {
  return (
    <section className="container mx-auto px-4 py-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-pink-400 p-10 text-primary-foreground sm:p-14">
        <div className="relative z-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/15 backdrop-blur-sm">
              <Percent className="h-8 w-8" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest opacity-70">Our Shoe & Bags</p>
              <h3 className="text-3xl font-extrabold sm:text-4xl tracking-tight">SPECIAL OFFER</h3>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium opacity-70">FOLLOW US ON</span>
            <div className="flex gap-2">
              {["f", "ig"].map((icon) => (
                <div key={icon} className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/15 backdrop-blur-sm text-sm font-bold hover:bg-primary-foreground/25 transition-colors cursor-pointer">
                  {icon}
                </div>
              ))}
            </div>
            <Button variant="outline" className="rounded-full border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 backdrop-blur-sm">
              @nipun's gallery
            </Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary-foreground/5 blur-xl" />
        <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-primary-foreground/5 blur-xl" />
        <div className="absolute right-1/3 top-1/2 h-24 w-24 rounded-full bg-primary-foreground/3" />
      </div>
    </section>
  );
};

export default SpecialOffer;
