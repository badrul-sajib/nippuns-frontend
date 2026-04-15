import { Minus, Plus, X, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, clearCart, totalItems, subtotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsOpen(false);
    navigate("/checkout");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-md p-0">
        <SheetHeader className="border-b border-border/60 px-6 py-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-lg font-bold">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Your Cart
              {totalItems > 0 && (
                <span className="ml-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </SheetTitle>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-foreground">Your cart is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">Add items to get started</p>
            </div>
            <Button variant="outline" className="rounded-full mt-2" onClick={() => setIsOpen(false)}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.color}-${item.size}`}
                  className="flex gap-4 rounded-2xl border border-border/40 bg-muted/30 p-3 transition-all hover:bg-muted/50"
                >
                  {/* Image */}
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-background">
                    <img src={item.image} alt={item.name} className="h-full w-full object-contain p-1" />
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-foreground truncate">{item.brand}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{item.name}</p>
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span className="h-2.5 w-2.5 rounded-full border border-border" style={{ backgroundColor: item.color === "default" ? "#888" : item.color }} />
                          {item.color}
                        </span>
                        <span>•</span>
                        <span>{item.size}</span>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      {/* Quantity */}
                      <div className="flex items-center rounded-lg border border-border bg-background">
                        <button
                          onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="flex h-7 w-7 items-center justify-center text-foreground/60 hover:text-foreground disabled:opacity-30 transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold text-foreground">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center text-foreground/60 hover:text-foreground transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-sm font-bold text-primary">
                        Tk {(item.price * item.quantity).toLocaleString()}
                      </span>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id, item.color, item.size)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-border/60 px-6 py-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal ({totalItems} items)</span>
                <span className="text-lg font-bold text-foreground">Tk {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Shipping</span>
                <span className={subtotal >= 3000 ? "text-emerald-600 font-medium" : ""}>
                  {subtotal >= 3000 ? "FREE" : "Tk 100"}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border/40 pt-3">
                <span className="text-sm font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-primary">
                  Tk {(subtotal + (subtotal >= 3000 ? 0 : 100)).toLocaleString()}
                </span>
              </div>
              <Button
                onClick={handleCheckout}
                className="w-full h-12 rounded-xl text-sm font-semibold shadow-lg shadow-primary/25 gap-2 active:scale-[0.98] transition-all"
              >
                Checkout
                <ArrowRight className="h-4 w-4" />
              </Button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
