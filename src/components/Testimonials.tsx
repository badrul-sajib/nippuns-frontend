import { Star, Quote } from "lucide-react";

const colors = [
  "from-primary/5 to-pink-50",
  "from-amber-50 to-orange-50/50",
  "from-blue-50 to-indigo-50/50",
  "from-emerald-50 to-teal-50/50",
  "from-purple-50 to-violet-50/50",
  "from-rose-50 to-pink-50/50",
];

const testimonials = [
  { name: "Fatima Rahman", role: "Regular Customer", text: "Amazing quality bags! I've bought from Nipun's Gallery multiple times and every product exceeded my expectations. The leather quality is premium and prices are very reasonable.", rating: 5 },
  { name: "Arif Hossain", role: "Verified Buyer", text: "Ordered a travel bag for my trip and it arrived within 2 days. The bag is sturdy, spacious, and looks exactly like the pictures. Highly recommend!", rating: 5 },
  { name: "Nusrat Jahan", role: "Fashion Enthusiast", text: "The ladies bag collection is gorgeous! I got so many compliments on my new handbag. Customer service was also very helpful in choosing the right size.", rating: 4 },
  { name: "Kamal Ahmed", role: "Corporate Buyer", text: "We ordered office bags for our team and the bulk pricing was excellent. Professional service and timely delivery. Will order again.", rating: 5 },
  { name: "Sadia Islam", role: "Happy Customer", text: "Best online bag store in Bangladesh! Great variety, fair prices, and genuine products. The gym bag I bought is perfect for my daily workouts.", rating: 5 },
  { name: "Rashed Khan", role: "Repeat Customer", text: "I've been shopping here for over a year now. The quality has been consistently excellent. My go-to store for all bag needs!", rating: 5 },
];

const Testimonials = () => {
  return (
    <section className="container mx-auto px-3 sm:px-4 py-6 sm:py-10">
      <div className="mb-6 sm:mb-8 text-center">
        <h2 className="text-base sm:text-lg font-bold text-foreground">What Our Customers Are Saying</h2>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">Trusted by thousands of happy customers</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <div key={i} className={`group rounded-2xl bg-gradient-to-br ${colors[i % colors.length]} border border-border/30 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1`}>
            <Quote className="h-6 w-6 text-primary/30 mb-3" />
            <p className="text-sm leading-relaxed text-foreground/70">{t.text}</p>
            <div className="mt-4 flex items-center gap-3 pt-4 border-t border-border/40">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-[11px] text-muted-foreground">{t.role}</p>
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
