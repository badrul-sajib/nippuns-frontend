import { Link, useNavigate } from "react-router-dom";
import { Heart, Star, ShoppingCart, Eye } from "lucide-react";
import ShimmerImage from "@/components/ShimmerImage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";

interface ProductCardProps {
  name: string;
  code: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  color: string;
  image?: string;
  productId?: string;
  isNew?: boolean;
  isHot?: boolean;
  showBuyNow?: boolean; // defaults to true
}

const ProductCard = ({
  name,
  code,
  price,
  originalPrice,
  rating,
  reviews,
  color,
  image,
  productId,
  isNew,
  isHot,
  showBuyNow = true,
}: ProductCardProps) => {
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const wishlisted = productId ? isInWishlist(productId) : false;

  const Wrapper = productId ? Link : "div";
  const wrapperProps = productId ? { to: `/product/${productId}` } : {};

  return (
    <Wrapper {...wrapperProps as any} className="group relative min-w-[160px] sm:min-w-[210px] w-full overflow-hidden rounded-xl sm:rounded-2xl border border-border/40 bg-card transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 block">
      {/* Badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
        {isHot && (
          <Badge className="bg-destructive text-primary-foreground text-[10px] px-2 py-0.5 shadow-sm">HOT</Badge>
        )}
        {isNew && (
          <Badge className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 shadow-sm">NEW</Badge>
        )}
        {discount > 0 && (
          <Badge className={`text-primary-foreground text-[10px] px-3 py-0.5 rounded-full border ${
            discount <= 30
              ? "bg-teal-600 border-teal-400/50 shadow-[0_0_8px_rgba(13,148,136,0.4)]"
              : discount <= 60
              ? "bg-purple-600 border-purple-400/50 shadow-[0_0_8px_rgba(147,51,234,0.4)]"
              : "bg-destructive border-red-400/50 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
          }`}>-{discount}%</Badge>
        )}
      </div>

      {/* Action buttons */}
      <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5 opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (productId) {
              toggleItem({ id: productId, name, brand: name, price, originalPrice, image: image || "", rating, reviews });
            }
          }}
          className={`flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition-colors ${
            wishlisted ? "bg-primary text-primary-foreground" : "bg-background/90 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground"
          }`}
        >
          <Heart className="h-3.5 w-3.5" fill={wishlisted ? "currentColor" : "none"} />
        </button>
        <button onClick={(e) => e.preventDefault()} className="flex h-8 w-8 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground">
          <Eye className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Image */}
      <div className={`mx-2 sm:mx-3 mt-2 sm:mt-3 mb-2 sm:mb-3 flex h-32 sm:h-44 items-center justify-center rounded-lg sm:rounded-xl ${color} overflow-hidden`}>
        {image ? (
          <ShimmerImage
            src={image}
            alt={name}
            className="h-full w-full object-contain p-2 sm:p-3 transition-transform duration-500 group-hover:scale-110"
            shimmerClassName="h-full w-full"
            loading="lazy"
            decoding="async"
            width={180}
            height={176}
          />
        ) : (
          <ShoppingCart className="h-10 w-10 text-muted-foreground/30" />
        )}
      </div>

      {/* Info */}
      <div className="px-2.5 sm:px-4 pb-3 sm:pb-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-foreground">{name}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">Code: {code}</p>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-sm sm:text-base font-bold text-primary">Tk {price.toLocaleString()}</span>
          <span className="text-[10px] sm:text-xs text-muted-foreground line-through">Tk {originalPrice.toLocaleString()}</span>
        </div>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`}
              />
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground">({reviews})</span>
        </div>

        {showBuyNow && (
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 rounded-full text-xs font-semibold active:scale-95 transition-all gap-1"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addItem({
                  id: productId || "0",
                  name,
                  brand: name,
                  price,
                  image: image || "",
                  color: "default",
                  size: "default",
                });
                toast.success(`${name} added to cart!`);
              }}
            >
              <ShoppingCart className="h-3 w-3" />
              Cart
            </Button>
            <Button
              size="sm"
              className="flex-1 rounded-full text-xs font-semibold shadow-md shadow-primary/20 active:scale-95 transition-all"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addItem({
                  id: productId || "0",
                  name,
                  brand: name,
                  price,
                  image: image || "",
                  color: "default",
                  size: "default",
                }, 1, false);
                navigate("/checkout");
              }}
            >
              Buy Now
            </Button>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default ProductCard;
