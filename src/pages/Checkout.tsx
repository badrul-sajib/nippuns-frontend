import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, MapPin, Phone, User, CreditCard, Truck, CheckCircle2, ArrowLeft, PartyPopper, Package, AlertTriangle, Minus, Plus, Trash2, Tag, X } from "lucide-react";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { useSettings } from "@/contexts/SettingsContext";
import { fetchProduct, fetchProducts } from "@/api/products";
import { validateCoupon } from "@/api/coupons";
import type { Product } from "@/types/product";
import { toast } from "sonner";

const paymentMethods = [
  { id: "cod", label: "COD", color: "text-foreground" },
  { id: "bkash", label: "bKash", color: "text-[hsl(330,80%,45%)]" },
  { id: "nagad", label: "Nagad", color: "text-[hsl(25,95%,50%)]" },
  { id: "rocket", label: "Rocket", color: "text-[hsl(270,70%,45%)]" },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, totalItems, clearCart, removeItem, updateQuantity } = useCart();
  const { addOrder } = useOrders();
  const { settings } = useSettings();
  const [orderId, setOrderId] = useState("");

  const merchantNumberFor = (method: string): string => {
    if (method === "bkash") return settings.bkash_merchant_number;
    if (method === "nagad") return settings.nagad_merchant_number;
    if (method === "rocket") return settings.rocket_merchant_number;
    return "";
  };

  // Pre-fill from saved profile
  const savedProfile = (() => {
    try {
      return JSON.parse(localStorage.getItem("nipuns_profile") || "{}");
    } catch { return {}; }
  })();

  const [name, setName] = useState(savedProfile.full_name || "");
  const [address, setAddress] = useState(savedProfile.address || "");
  const [phone, setPhone] = useState(savedProfile.phone || "");
  const [deliveryZone, setDeliveryZone] = useState("inside");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [transactionId, setTransactionId] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; type: "percent" | "fixed" } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const [productMap, setProductMap] = useState<Record<string, Product>>({});
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Fetch full product info for cart items (to get advanceAmount)
  useEffect(() => {
    let cancelled = false;
    const idsToFetch = items.map((i) => i.id).filter((id) => !productMap[id]);
    if (idsToFetch.length === 0) return;
    Promise.all(
      idsToFetch.map((id) =>
        fetchProduct(id)
          .then((data) => (data?.product || data?.data || data) as Product)
          .catch(() => null)
      )
    ).then((results) => {
      if (cancelled) return;
      setProductMap((prev) => {
        const next = { ...prev };
        results.forEach((p) => { if (p?.id) next[String(p.id)] = p; });
        return next;
      });
    });
    return () => { cancelled = true; };
  }, [items]);

  // Fetch related products
  useEffect(() => {
    let cancelled = false;
    fetchProducts({ page: 1 })
      .then((data) => {
        if (cancelled) return;
        const list: Product[] = data?.data || data || [];
        setRelatedProducts(list);
      })
      .catch(() => setRelatedProducts([]));
    return () => { cancelled = true; };
  }, []);

  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) { setCouponError("কুপন কোড লিখুন"); return; }
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await validateCoupon(code);
      const coupon = res?.data || res;
      const type: "percent" | "fixed" =
        (coupon.discount_type || coupon.type) === "percent" ||
        (coupon.discount_type || coupon.type) === "percentage"
          ? "percent"
          : "fixed";
      const discountValue = Number(coupon.discount_value ?? coupon.discount ?? 0);
      const minOrder = Number(coupon.min_order_amount ?? coupon.minOrder ?? 0);

      if (minOrder && subtotal < minOrder) {
        setCouponError(`এই কুপনের জন্য সর্বনিম্ন অর্ডার Tk ${minOrder.toLocaleString()} প্রয়োজন। আপনার বর্তমান সাবটোটাল Tk ${subtotal.toLocaleString()}। আরো Tk ${(minOrder - subtotal).toLocaleString()} যোগ করুন।`);
        return;
      }
      const discountAmount = type === "percent" ? Math.round(subtotal * discountValue / 100) : discountValue;
      setAppliedCoupon({ code, discount: discountAmount, type });
      toast.success(`কুপন "${code}" প্রয়োগ হয়েছে! Tk ${discountAmount} ছাড়`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "ভুল কুপন কোড";
      setCouponError(msg);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const couponDiscount = appliedCoupon?.discount || 0;
  const shippingCost = deliveryZone === "inside" ? 80 : 150;
  const total = subtotal - couponDiscount + shippingCost;

  // Calculate total advance amount required from cart items
  const totalAdvance = useMemo(() => {
    return items.reduce((sum, item) => {
      const product = productMap[item.id];
      if (product?.advanceAmount) {
        return sum + Number(product.advanceAmount) * item.quantity;
      }
      return sum;
    }, 0);
  }, [items, productMap]);

  const hasAdvanceItems = totalAdvance > 0;
  const dueOnDelivery = total - totalAdvance;
  const isMobilePayment = ["bkash", "nagad", "rocket"].includes(paymentMethod);

  // Filter out items already in cart from related products
  const cartIds = useMemo(() => new Set(items.map((i) => i.id)), [items]);
  const visibleRelated = useMemo(
    () => relatedProducts.filter((p) => !cartIds.has(p.id)).slice(0, 5),
    [relatedProducts, cartIds]
  );

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!address.trim()) errs.address = "Address is required";
    if (!phone.trim()) errs.phone = "Phone number is required";
    else if (!/^01[3-9]\d{8}$/.test(phone.trim())) errs.phone = "Enter a valid BD phone number";

    // If advance payment required and mobile payment selected, require transaction ID
    if (hasAdvanceItems && isMobilePayment && !transactionId.trim()) {
      errs.transactionId = "Transaction ID is required for advance payment";
    }

    // If advance payment required and COD selected, block it
    if (hasAdvanceItems && paymentMethod === "cod") {
      errs.payment = "Advance payment required — please select bKash, Nagad, or Rocket";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const apiPayload = {
      items: items.map((i) => ({
        product_id: Number(i.id),
        quantity: i.quantity,
      })),
      shipping_name: name,
      shipping_phone: phone,
      shipping_address: address,
      shipping_district: deliveryZone === "inside" ? "Dhaka" : "Other",
      payment_method: paymentMethod,
      ...(appliedCoupon?.code ? { coupon_code: appliedCoupon.code } : {}),
    };

    try {
      const id = await addOrder(
        {
          items: items.map((i) => ({ id: i.id, name: i.name, image: i.image, price: i.price, quantity: i.quantity })),
          subtotal,
          shippingCost,
          total,
          name,
          phone,
          address,
          deliveryZone: deliveryZone as "inside" | "outside",
          paymentMethod: paymentMethods.find((m) => m.id === paymentMethod)?.label || paymentMethod,
        },
        apiPayload,
      );
      setOrderId(id);
      setShowSuccess(true);
      clearCart();
    } catch (err: any) {
      toast.error(err?.message || "Could not place order. Please try again.");
    }
  };

  if (items.length === 0 && !showSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/40" />
          <h2 className="mt-4 text-xl font-bold text-foreground">Your cart is empty</h2>
          <p className="mt-2 text-sm text-muted-foreground">Add some products before checking out.</p>
          <Button className="mt-6 rounded-full" onClick={() => navigate("/")}>Continue Shopping</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold text-foreground mb-4">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left — Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Info */}
              <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider">
                  <User className="h-4 w-4 text-primary" /> Personal Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-xs font-medium text-muted-foreground">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`mt-1.5 rounded-xl ${errors.name ? "border-destructive" : ""}`}
                    />
                    {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-xs font-medium text-muted-foreground">Phone Number *</Label>
                    <div className="relative mt-1.5">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        placeholder="01XXXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`pl-10 rounded-xl ${errors.phone ? "border-destructive" : ""}`}
                      />
                    </div>
                    {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-xs font-medium text-muted-foreground">Delivery Address *</Label>
                    <div className="relative mt-1.5">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <textarea
                        id="address"
                        placeholder="House, Road, Area, City"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={3}
                        className={`w-full pl-10 rounded-xl border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${errors.address ? "border-destructive" : "border-input"}`}
                      />
                    </div>
                    {errors.address && <p className="mt-1 text-xs text-destructive">{errors.address}</p>}
                  </div>
                </div>
              </div>

              {/* Delivery Zone */}
              <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider">
                  <Truck className="h-4 w-4 text-primary" /> Delivery Zone
                </h3>
                <RadioGroup value={deliveryZone} onValueChange={setDeliveryZone} className="grid grid-cols-2 gap-3">
                  {[
                    { value: "inside", label: "Inside Dhaka", cost: 80 },
                    { value: "outside", label: "Outside Dhaka", cost: 150 },
                  ].map((zone) => (
                    <label
                      key={zone.value}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                        deliveryZone === zone.value
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border/40 hover:border-primary/30"
                      }`}
                    >
                      <RadioGroupItem value={zone.value} />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{zone.label}</p>
                        <p className="text-xs text-muted-foreground">Tk {zone.cost}</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </div>

              {/* Payment Method */}
              <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider">
                  <CreditCard className="h-4 w-4 text-primary" /> Payment Method
                </h3>

                {/* Advance payment notice */}
                {hasAdvanceItems && (
                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800">Advance Payment Required</p>
                      <p className="text-xs text-amber-700 mt-1">
                        আপনার কার্টে কিছু প্রোডাক্ট এ অগ্রিম পেমেন্ট প্রয়োজন। মোট অগ্রিম: <span className="font-bold">Tk {totalAdvance.toLocaleString()}</span>
                      </p>
                      <p className="text-xs text-amber-600 mt-0.5">
                        বাকি Tk {dueOnDelivery.toLocaleString()} ডেলিভারির সময় পরিশোধ করতে হবে।
                      </p>
                    </div>
                  </div>
                )}

                {errors.payment && <p className="text-xs text-destructive font-medium">{errors.payment}</p>}

                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {paymentMethods.map((method) => {
                    const disabled = hasAdvanceItems && method.id === "cod";
                    return (
                      <label
                        key={method.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                          disabled ? "opacity-50 cursor-not-allowed" :
                          paymentMethod === method.id
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border/40 hover:border-primary/30"
                        }`}
                      >
                        <RadioGroupItem value={method.id} disabled={disabled} />
                        <div>
                          <span className={`text-sm font-semibold ${method.color}`}>{method.label}</span>
                          {disabled && <p className="text-[10px] text-destructive">Advance required</p>}
                        </div>
                      </label>
                    );
                  })}
                </RadioGroup>

                {/* bKash/Nagad/Rocket payment instructions */}
                {isMobilePayment && hasAdvanceItems && (
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3 mt-2">
                    <p className="text-sm font-semibold text-foreground">
                      {paymentMethods.find(m => m.id === paymentMethod)?.label} Payment Instructions
                    </p>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <p>1. {paymentMethods.find(m => m.id === paymentMethod)?.label} অ্যাপ ওপেন করুন</p>
                      <p>2. "Send Money" সিলেক্ট করুন</p>
                      <p>3. এই নম্বরে পাঠান: <span className="font-bold text-foreground select-all">{merchantNumberFor(paymentMethod) || "—"}</span></p>
                      <p>4. পরিমাণ: <span className="font-bold text-primary">Tk {totalAdvance.toLocaleString()}</span></p>
                      <p>5. নিচে Transaction ID দিন</p>
                    </div>
                    <div>
                      <Label htmlFor="txnId" className="text-xs font-medium text-muted-foreground">Transaction ID *</Label>
                      <Input
                        id="txnId"
                        placeholder="e.g. ABC12XYZ34"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className={`mt-1.5 rounded-xl ${errors.transactionId ? "border-destructive" : ""}`}
                      />
                      {errors.transactionId && <p className="mt-1 text-xs text-destructive">{errors.transactionId}</p>}
                    </div>
                  </div>
                )}

                {/* Mobile payment without advance - just show number */}
                {isMobilePayment && !hasAdvanceItems && (
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2 mt-2">
                    <p className="text-sm font-semibold text-foreground">
                      {paymentMethods.find(m => m.id === paymentMethod)?.label} Payment (Optional)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      আপনি চাইলে আগেই পেমেন্ট করতে পারেন অথবা ডেলিভারির সময় পরিশোধ করতে পারেন।
                    </p>
                    <p className="text-xs text-muted-foreground">
                      নম্বর: <span className="font-bold text-foreground select-all">{merchantNumberFor(paymentMethod) || "—"}</span>
                    </p>
                    <div>
                      <Label htmlFor="txnIdOpt" className="text-xs font-medium text-muted-foreground">Transaction ID (যদি পেমেন্ট করে থাকেন)</Label>
                      <Input
                        id="txnIdOpt"
                        placeholder="e.g. ABC12XYZ34"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="mt-1.5 rounded-xl"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right — Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-border/40 bg-card p-6 space-y-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider">
                  <ShoppingBag className="h-4 w-4 text-primary" /> Order Summary
                </h3>

                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {items.map((item) => {
                    const product = productMap[item.id];
                    return (
                      <div key={`${item.id}-${item.color}-${item.size}`} className="flex items-center gap-3">
                        <div className="h-14 w-14 flex-shrink-0 rounded-xl bg-muted overflow-hidden">
                          <img src={item.image} alt={item.name} className="h-full w-full object-contain p-1" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <div className="flex items-center rounded-md border border-border bg-background">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="flex h-6 w-6 items-center justify-center text-foreground/60 hover:text-foreground disabled:opacity-30 transition-colors"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-6 text-center text-[11px] font-semibold text-foreground">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity + 1)}
                                className="flex h-6 w-6 items-center justify-center text-foreground/60 hover:text-foreground transition-colors"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id, item.color, item.size)}
                              className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                          {product?.advanceAmount && (
                            <p className="text-[10px] font-medium text-amber-600 mt-0.5">
                              অগ্রিম: Tk {(product.advanceAmount * item.quantity).toLocaleString()}
                            </p>
                          )}
                        </div>
                        <span className="text-xs font-bold text-foreground">Tk {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Coupon Code */}
                <div className="space-y-2">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-emerald-600" />
                        <div>
                          <span className="text-xs font-bold text-emerald-700">{appliedCoupon.code}</span>
                          <p className="text-[10px] text-emerald-600">Tk {appliedCoupon.discount.toLocaleString()} ছাড়</p>
                        </div>
                      </div>
                      <button type="button" onClick={removeCoupon} className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-emerald-100 text-emerald-600 transition-colors">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="কুপন কোড লিখুন"
                          value={couponCode}
                          onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                          maxLength={20}
                          className="rounded-xl text-xs h-9"
                        />
                        <Button type="button" variant="outline" size="sm" onClick={handleApplyCoupon} disabled={couponLoading} className="rounded-xl text-xs h-9 px-4 shrink-0">
                          {couponLoading ? "..." : "Apply"}
                        </Button>
                      </div>
                      {couponError && <p className="text-[11px] text-destructive mt-1.5 leading-relaxed">{couponError}</p>}
                      <p className="text-[10px] text-muted-foreground mt-1.5">
                        কুপন কোড থাকলে এখানে লিখুন এবং Apply তে ক্লিক করুন
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t border-border/40 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>Tk {subtotal.toLocaleString()}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-sm font-medium text-emerald-600">
                      <span>Coupon Discount</span>
                      <span>-Tk {couponDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping ({deliveryZone === "inside" ? "Inside Dhaka" : "Outside Dhaka"})</span>
                    <span>Tk {shippingCost}</span>
                  </div>

                  {hasAdvanceItems && (
                    <>
                      <div className="flex justify-between text-sm font-medium text-amber-600 bg-amber-50 rounded-lg px-2 py-1.5">
                        <span>অগ্রিম পেমেন্ট</span>
                        <span>Tk {totalAdvance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>ডেলিভারিতে বাকি</span>
                        <span>Tk {dueOnDelivery.toLocaleString()}</span>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between border-t border-border/40 pt-3">
                    <span className="text-sm font-bold text-foreground">Total</span>
                    <span className="text-lg font-bold text-primary">Tk {total.toLocaleString()}</span>
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 rounded-xl text-sm font-semibold shadow-lg shadow-primary/25 gap-2 active:scale-[0.98] transition-all">
                  <CheckCircle2 className="h-4 w-4" />
                  {hasAdvanceItems ? `Pay Tk ${totalAdvance.toLocaleString()} & Place Order` : "Place Order"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={(open) => { if (!open) { setShowSuccess(false); navigate("/"); } }}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden border-0 rounded-2xl max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-br from-primary/10 via-background to-primary/5 p-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4">
              <PartyPopper className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Order Placed Successfully! 🎉</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Thank you for your order. We'll contact you at <span className="font-semibold text-foreground">{phone}</span> to confirm delivery.
            </p>
            {orderId && (
              <p className="mt-2 text-xs text-muted-foreground">
                Order ID: <span className="font-bold text-foreground">{orderId}</span>
              </p>
            )}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Truck className="h-4 w-4" />
                {deliveryZone === "inside" ? "Inside Dhaka" : "Outside Dhaka"} — {paymentMethods.find((m) => m.id === paymentMethod)?.label}
              </div>
              {orderId && (
                <Button variant="outline" size="sm" className="rounded-full gap-1.5" onClick={() => { setShowSuccess(false); navigate(`/orders/${orderId}`); }}>
                  <Package className="h-3.5 w-3.5" /> Track Order
                </Button>
              )}
              {/* WhatsApp Order Confirmation */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `✅ অর্ডার কনফার্ম!\n\n🛍️ Order ID: ${orderId}\n👤 ${name}\n📞 ${phone}\n📍 ${address}\n💰 Total: Tk ${total.toLocaleString()}\n🚚 ${deliveryZone === "inside" ? "Inside Dhaka" : "Outside Dhaka"}\n💳 ${paymentMethods.find((m) => m.id === paymentMethod)?.label}\n\nNipun's Gallery 🎀`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" className="rounded-full gap-1.5 border-emerald-300 text-emerald-600 hover:bg-emerald-50">
                  📲 WhatsApp এ শেয়ার করুন
                </Button>
              </a>
            </div>
          </div>

          {/* Related Products */}
          <div className="px-6 pb-6">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 mt-2">You May Also Like</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {visibleRelated.slice(0, 3).map((p) => (
                <ProductCard
                  key={p.id}
                  name={p.brand}
                  code={p.code}
                  price={p.price}
                  originalPrice={p.originalPrice}
                  rating={p.rating}
                  reviews={p.reviews}
                  color="bg-muted/40"
                  image={p.images?.[0]}
                  productId={p.id}
                  showBuyNow
                />
              ))}
            </div>
            <Button
              className="w-full mt-4 rounded-full"
              variant="outline"
              onClick={() => { setShowSuccess(false); navigate("/"); }}
            >
              Continue Shopping
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Checkout;
