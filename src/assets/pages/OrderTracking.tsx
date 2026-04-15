import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Package, Truck, CheckCircle2, Clock, MapPin, Phone, ArrowLeft, Search, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useOrders, OrderStatus } from "@/contexts/OrderContext";

const statusSteps: { key: OrderStatus; label: string; icon: typeof Package }[] = [
  { key: "confirmed", label: "Order Confirmed", icon: CheckCircle2 },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

const statusIndex = (s: OrderStatus) => statusSteps.findIndex((st) => st.key === s);

const OrderTracking = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { orders, getOrder } = useOrders();
  const [searchId, setSearchId] = useState("");

  const order = id ? getOrder(id) : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) navigate(`/orders/${searchId.trim()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-6 text-center">Order Tracking</h1>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-8 flex gap-2 max-w-md mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Enter Order ID (e.g. ORD-M5X...)" value={searchId} onChange={(e) => setSearchId(e.target.value)} className="pl-10 rounded-xl" />
          </div>
          <Button type="submit" className="rounded-xl">Track</Button>
        </form>

        {/* Order Detail */}
        {id && order ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="rounded-2xl border border-border/40 bg-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Order ID</p>
                  <p className="text-lg font-bold text-foreground">{order.id}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-xl font-bold text-primary">Tk {order.total.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">{order.paymentMethod}</p>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="rounded-2xl border border-border/40 bg-card p-6">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-6">Delivery Status</h3>
              <div className="relative flex items-center justify-between">
                {/* Progress line */}
                <div className="absolute top-5 left-0 right-0 h-1 bg-muted rounded-full" />
                <div
                  className="absolute top-5 left-0 h-1 bg-primary rounded-full transition-all duration-700"
                  style={{ width: `${(statusIndex(order.status) / (statusSteps.length - 1)) * 100}%` }}
                />
                {statusSteps.map((step, i) => {
                  const active = i <= statusIndex(order.status);
                  const current = i === statusIndex(order.status);
                  const Icon = step.icon;
                  return (
                    <div key={step.key} className="relative z-10 flex flex-col items-center gap-2">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                        current ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110"
                        : active ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground"
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className={`text-[11px] font-medium text-center max-w-[80px] ${active ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 flex items-center gap-2 rounded-xl bg-primary/5 p-3 text-sm">
                <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">
                  Estimated delivery:{" "}
                  <span className="font-semibold text-foreground">
                    {new Date(order.estimatedDelivery).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                </span>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/40 bg-card p-5 space-y-2">
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> Delivery Address
                </h4>
                <p className="text-sm font-medium text-foreground">{order.name}</p>
                <p className="text-xs text-muted-foreground">{order.address}</p>
                <p className="text-xs text-muted-foreground">{order.deliveryZone === "inside" ? "Inside Dhaka" : "Outside Dhaka"}</p>
              </div>
              <div className="rounded-2xl border border-border/40 bg-card p-5 space-y-2">
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 text-primary" /> Contact
                </h4>
                <p className="text-sm font-medium text-foreground">{order.phone}</p>
                <p className="text-xs text-muted-foreground">Payment: {order.paymentMethod}</p>
              </div>
            </div>

            {/* Items */}
            <div className="rounded-2xl border border-border/40 bg-card p-6">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">Items ({order.items.length})</h3>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl bg-muted/30 p-3">
                    <div className="h-14 w-14 flex-shrink-0 rounded-xl bg-background overflow-hidden">
                      <img src={item.image} alt={item.name} className="h-full w-full object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-foreground">Tk {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-border/40 pt-3 space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Subtotal</span><span>Tk {order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Shipping</span><span>Tk {order.shippingCost}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-foreground pt-1">
                  <span>Total</span><span className="text-primary">Tk {order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ) : id ? (
          <div className="text-center py-16">
            <Package className="mx-auto h-16 w-16 text-muted-foreground/40" />
            <h2 className="mt-4 text-lg font-bold text-foreground">Order not found</h2>
            <p className="mt-1 text-sm text-muted-foreground">Check your order ID and try again.</p>
          </div>
        ) : null}

        {/* Recent Orders List */}
        {!id && orders.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Your Orders</h3>
            {orders.map((o) => {
              const updated = { ...o, status: statusSteps[statusIndex(o.status) >= 0 ? statusIndex(o.status) : 0] };
              return (
                <Link key={o.id} to={`/orders/${o.id}`} className="flex items-center justify-between rounded-2xl border border-border/40 bg-card p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{o.id}</p>
                      <p className="text-xs text-muted-foreground">{o.items.length} items • {new Date(o.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">Tk {o.total.toLocaleString()}</p>
                    <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      o.status === "delivered" ? "bg-emerald-100 text-emerald-700"
                      : o.status === "shipped" ? "bg-blue-100 text-blue-700"
                      : "bg-amber-100 text-amber-700"
                    }`}>
                      {o.status}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {!id && orders.length === 0 && (
          <div className="text-center py-16">
            <Package className="mx-auto h-16 w-16 text-muted-foreground/40" />
            <h2 className="mt-4 text-lg font-bold text-foreground">No orders yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">Place an order and track it here.</p>
            <Button className="mt-4 rounded-full" onClick={() => navigate("/")}>Start Shopping</Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrderTracking;
