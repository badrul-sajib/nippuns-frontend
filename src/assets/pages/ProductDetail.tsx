import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Heart, ShoppingCart, Star, Minus, Plus, Share2, Truck, RotateCcw, Shield, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getProductById, products } from "@/data/products";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProductById(id || "1");

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { toggleItem, isInWishlist } = useWishlist();
  const { viewedIds, addViewed } = useRecentlyViewed();
  const isWishlisted = product ? isInWishlist(product.id) : false;

  // Track recently viewed
  useEffect(() => {
    if (product) addViewed(product.id);
  }, [product?.id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Product not found</h1>
          <Button className="mt-4" onClick={() => navigate("/")}>Go Home</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);

  const { addItem } = useCart();

  const handleAddToCart = (openDrawer = true) => {
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.images[0],
      color: product.colors[selectedColor].name,
      size: product.sizes[selectedSize],
    }, quantity, openDrawer);
    toast.success(`${product.name} added to cart!`);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const text = `${product.name} - Tk ${product.price.toLocaleString()} | Nipun's Gallery`;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  // Recently viewed products (exclude current)
  const recentlyViewedProducts = viewedIds
    .filter((vid) => vid !== product.id)
    .map((vid) => products.find((p) => p.id === vid))
    .filter(Boolean)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="hover:text-primary transition-colors cursor-pointer">{product.category}</span>
          <span>/</span>
          <span className="text-foreground font-medium">{product.name}</span>
        </div>
      </div>

      {/* Product Section */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Left Column: Image Gallery + Description */}
          <div>
            <div className="flex flex-col-reverse gap-4 sm:flex-row">
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: "none" }}>
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 h-20 w-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === i
                        ? "border-primary shadow-md shadow-primary/20"
                        : "border-border/40 hover:border-primary/40"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-contain bg-muted/30 p-1" />
                  </button>
                ))}
              </div>
              <div className="flex-1 relative group">
                <div className="aspect-square rounded-2xl bg-muted/30 overflow-hidden border border-border/30">
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="h-full w-full object-contain p-8 transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                {discount > 0 && (
                  <Badge className="absolute left-4 top-4 bg-destructive text-primary-foreground text-sm px-3 py-1 shadow-lg">
                    -{discount}% OFF
                  </Badge>
                )}
                <button
                  onClick={() => product && toggleItem({ id: product.id, name: product.name, brand: product.brand, price: product.price, originalPrice: product.originalPrice, image: product.images[0], rating: product.rating, reviews: product.reviews })}
                  className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-all ${
                    isWishlisted
                      ? "bg-primary text-primary-foreground"
                      : "bg-background/90 backdrop-blur-sm text-muted-foreground hover:text-primary"
                  }`}
                >
                  <Heart className="h-5 w-5" fill={isWishlisted ? "currentColor" : "none"} />
                </button>
              </div>
            </div>

            {/* Description & Care Tips */}
            <div className="mt-6 border-t border-border">
              <details className="group" open>
                <summary className="flex cursor-pointer items-center justify-between py-4 text-sm font-semibold text-foreground">
                  Description
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <div className="pb-4 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                  {product.description}
                </div>
              </details>
              <details className="group border-t border-border">
                <summary className="flex cursor-pointer items-center justify-between py-4 text-sm font-semibold text-foreground">
                  Care Tips
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <div className="pb-4 text-sm leading-relaxed text-muted-foreground">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Wipe clean with a soft, dry cloth</li>
                    <li>Avoid direct sunlight and excessive heat</li>
                    <li>Store in a dust bag when not in use</li>
                    <li>Keep away from water and harsh chemicals</li>
                  </ul>
                </div>
              </details>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-bold">
                {product.brand}
              </Badge>
              <span className="text-xs text-muted-foreground">Code: {product.code}</span>
            </div>

            <h1 className="mt-3 text-2xl font-bold text-foreground lg:text-3xl">{product.name}</h1>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < product.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
              {product.inStock && (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <Check className="h-3.5 w-3.5" /> In Stock
                </span>
              )}
            </div>

            {/* Price */}
            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">Tk {product.price.toLocaleString()}</span>
              <span className="text-lg text-muted-foreground line-through">Tk {product.originalPrice.toLocaleString()}</span>
              <Badge className="bg-primary/10 text-primary border-0 text-xs">Save {discount}%</Badge>
            </div>

            {/* Advance Payment Notice */}
            {product.advanceAmount && (
              <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-center gap-2">
                <span className="text-amber-600 text-sm">⚡</span>
                <p className="text-xs text-amber-800">
                  এই প্রোডাক্টে অগ্রিম <span className="font-bold">Tk {product.advanceAmount.toLocaleString()}</span> bKash/Nagad এ পেমেন্ট করতে হবে
                </p>
              </div>
            )}


            {/* Color */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-foreground mb-3">
                Color: <span className="font-normal text-muted-foreground">{product.colors[selectedColor].name}</span>
              </p>
              <div className="flex gap-2.5">
                {product.colors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    className={`h-9 w-9 rounded-full transition-all ${
                      selectedColor === i
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                        : "ring-1 ring-border hover:ring-primary/50"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-foreground mb-3">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSize(i)}
                    className={`rounded-xl px-5 py-2 text-sm font-medium transition-all ${
                      selectedSize === i
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                        : "border border-border bg-background text-foreground/70 hover:border-primary/40"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity, Buy Now & Add to Cart */}
            <div className="mt-8 space-y-3 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:gap-4">
              {/* Row 1: Quantity + Buy Now */}
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-xl border border-border">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-11 w-11 items-center justify-center text-foreground/60 hover:text-foreground transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-semibold text-foreground">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-11 w-11 items-center justify-center text-foreground/60 hover:text-foreground transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <Button
                  onClick={() => {
                    handleAddToCart(false);
                    navigate("/checkout");
                  }}
                  className="flex-1 h-11 rounded-xl text-sm font-semibold shadow-lg shadow-primary/25 transition-all active:scale-[0.98] gap-2"
                >
                  Buy Now — Tk {(product.price * quantity).toLocaleString()}
                </Button>
              </div>

              {/* Row 2: Add to Cart + Share */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleAddToCart()}
                  className="flex-1 sm:flex-none h-11 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] gap-2 px-6"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>

                <button onClick={handleShare} className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-all">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { icon: Truck, label: "Free Shipping", sub: "Over 3000TK" },
                { icon: RotateCcw, label: "Easy Returns", sub: "30 Days" },
                { icon: Shield, label: "Secure Pay", sub: "100% Safe" },
              ].map((f, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 rounded-xl bg-muted/50 p-3 text-center">
                  <f.icon className="h-4 w-4 text-primary" />
                  <span className="text-[11px] font-semibold text-foreground">{f.label}</span>
                  <span className="text-[10px] text-muted-foreground">{f.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="mb-6 text-lg font-bold text-foreground">You May Also Like</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                name={p.brand}
                code={p.code}
                price={p.price}
                originalPrice={p.originalPrice}
                rating={p.rating}
                reviews={p.reviews}
                color="bg-muted/30"
                image={p.images[0]}
                productId={p.id}
                showBuyNow
              />
            ))}
          </div>
        </div>

        {/* Recently Viewed */}
        {recentlyViewedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-lg font-bold text-foreground">Recently Viewed</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
              {recentlyViewedProducts.map((p: any) => (
                <ProductCard
                  key={p.id}
                  name={p.brand}
                  code={p.code}
                  price={p.price}
                  originalPrice={p.originalPrice}
                  rating={p.rating}
                  reviews={p.reviews}
                  color="bg-muted/30"
                  image={p.images[0]}
                  productId={p.id}
                  showBuyNow
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-border bg-background/95 backdrop-blur-md px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-lg font-bold text-primary leading-tight">Tk {(product.price * quantity).toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground line-through">Tk {(product.originalPrice * quantity).toLocaleString()}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl h-10 px-4 text-xs font-semibold gap-1.5"
            onClick={() => handleAddToCart()}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Cart
          </Button>
          <Button
            size="sm"
            className="rounded-xl h-10 px-5 text-xs font-semibold shadow-md shadow-primary/25 gap-1.5"
            onClick={() => { handleAddToCart(false); navigate("/checkout"); }}
          >
            Buy Now
          </Button>
        </div>
      </div>

      {/* Add padding for sticky bar on mobile */}
      <div className="h-20 md:hidden" />

      <Footer />
    </div>
  );
};

export default ProductDetail;
