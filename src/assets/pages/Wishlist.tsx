import { Link } from "react-router-dom";
import { Heart, Star, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const Wishlist = () => {
  const { items, removeItem } = useWishlist();
  const { addItem: addToCart } = useCart();

  const handleMoveToCart = (item: typeof items[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      brand: item.brand,
      price: item.price,
      image: item.image,
      color: "default",
      size: "default",
    });
    removeItem(item.id);
    toast.success("Moved to cart!", { description: item.name });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Wishlist</span>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <Heart className="h-5 w-5 text-primary" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Wishlist</h1>
            <p className="text-sm text-muted-foreground">{items.length} {items.length === 1 ? "item" : "items"} saved</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-foreground">Your wishlist is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">Save items you love to find them later</p>
            </div>
            <Link to="/">
              <Button variant="outline" className="rounded-full mt-2">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => {
              const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
              return (
                <div key={item.id} className="group rounded-2xl border border-border/40 bg-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                  {/* Image */}
                  <Link to={`/product/${item.id}`}>
                    <div className="relative h-52 bg-muted/30 overflow-hidden">
                      <img src={item.image} alt={item.name} className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-110" />
                      {discount > 0 && (
                        <span className="absolute left-3 top-3 rounded-full bg-foreground text-background text-[10px] font-bold px-2.5 py-0.5">-{discount}%</span>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-foreground">{item.brand}</p>
                    <Link to={`/product/${item.id}`}>
                      <p className="text-sm text-muted-foreground mt-0.5 hover:text-primary transition-colors truncate">{item.name}</p>
                    </Link>

                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-base font-bold text-primary">Tk {item.price.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground line-through">Tk {item.originalPrice.toLocaleString()}</span>
                    </div>

                    <div className="mt-2 flex items-center gap-1">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < item.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`} />
                        ))}
                      </div>
                      <span className="text-[10px] text-muted-foreground">({item.reviews})</span>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 rounded-full text-xs font-semibold gap-1.5 shadow-md shadow-primary/20 active:scale-95 transition-all"
                        onClick={() => handleMoveToCart(item)}
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        Move to Cart
                      </Button>
                      <button
                        onClick={() => {
                          removeItem(item.id);
                          toast.info("Removed from wishlist");
                        }}
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/5 transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;
