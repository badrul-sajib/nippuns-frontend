import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { fetchTestimonials } from "@/api/settings";

interface Testimonial {
  id: number;
  name: string;
  role: string | null;
  text: string;
  rating: number;
  avatar_url: string | null;
}

const colors = [
  "from-primary/5 to-pink-50",
  "from-amber-50 to-orange-50/50",
  "from-blue-50 to-indigo-50/50",
  "from-emerald-50 to-teal-50/50",
  "from-purple-50 to-violet-50/50",
  "from-rose-50 to-pink-50/50",
];

const Testimonials = () => {
  const { settings } = useSettings();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchTestimonials()
      .then((data: Testimonial[]) => {
        if (cancelled) return;
        setTestimonials(Array.isArray(data) ? data : []);
      })
      .catch(() => setTestimonials([]))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (!loading && testimonials.length === 0) return null;

  return (
    <section className="container mx-auto px-3 sm:px-4 py-6 sm:py-10">
      <div className="mb-6 sm:mb-8 text-center">
        <h2 className="text-base sm:text-lg font-bold text-foreground">{settings.section_testimonials_title}</h2>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{settings.section_testimonials_subtitle}</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <div key={t.id} className={`group rounded-2xl bg-gradient-to-br ${colors[i % colors.length]} border border-border/30 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1`}>
            <Quote className="h-6 w-6 text-primary/30 mb-3" />
            <p className="text-sm leading-relaxed text-foreground/70">{t.text}</p>
            <div className="mt-4 flex items-center gap-3 pt-4 border-t border-border/40">
              {t.avatar_url ? (
                <img src={t.avatar_url} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {t.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                {t.role && <p className="text-[11px] text-muted-foreground">{t.role}</p>}
              </div>
              <div className="ml-auto flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-3 w-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
