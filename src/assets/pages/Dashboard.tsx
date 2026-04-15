import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User, Package, Heart, ShoppingBag, MapPin, Phone, Edit2, Save, X,
  TrendingUp, Calendar, ArrowLeft, ChevronRight, Truck, LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useOrders } from "@/contexts/OrderContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  full_name: string;
  phone: string;
  address: string;
  city: string;
}

const PROFILE_KEY = "nipuns_profile";

const Dashboard = () => {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { items: wishlistItems } = useWishlist();
  const { totalItems: cartItems } = useCart();
  const { toast } = useToast();

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem(PROFILE_KEY);
      return stored ? JSON.parse(stored) : { full_name: "", phone: "", address: "", city: "" };
    } catch {
      return { full_name: "", phone: "", address: "", city: "" };
    }
  });
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>(profile);

  const handleSave = () => {
    setProfile(editForm);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(editForm));
    setEditing(false);
    toast({ title: "Profile updated!" });
  };

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const recentOrders = orders.slice(0, 3);

  const stats = [
    { label: "Total Orders", value: orders.length, icon: Package, color: "bg-primary/10 text-primary" },
    { label: "Total Spent", value: `Tk ${totalSpent.toLocaleString()}`, icon: TrendingUp, color: "bg-emerald-50 text-emerald-600" },
    { label: "Wishlist", value: wishlistItems.length, icon: Heart, color: "bg-pink-50 text-pink-600" },
    { label: "Cart Items", value: cartItems, icon: ShoppingBag, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-8">My Dashboard</h1>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-border/40 bg-card p-4 text-center">
                  <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl ${s.color} mb-2`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <p className="text-lg font-bold text-foreground">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-border/40 bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider">
                  <Package className="h-4 w-4 text-primary" /> Recent Orders
                </h3>
                <Link to="/orders" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                  View All →
                </Link>
              </div>

              {recentOrders.length > 0 ? (
                <div className="space-y-3">
                  {recentOrders.map((o) => (
                    <Link
                      key={o.id}
                      to={`/orders/${o.id}`}
                      className="flex items-center justify-between rounded-xl bg-muted/30 p-3 hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                          <Truck className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">{o.id}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {o.items.length} items • {new Date(o.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-xs font-bold text-primary">Tk {o.total.toLocaleString()}</p>
                          <span className={`text-[9px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            o.status === "delivered" ? "bg-emerald-100 text-emerald-700"
                            : o.status === "shipped" ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                          }`}>
                            {o.status}
                          </span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="mx-auto h-10 w-10 text-muted-foreground/30" />
                  <p className="mt-2 text-sm text-muted-foreground">No orders yet</p>
                  <Button variant="outline" size="sm" className="mt-3 rounded-full" onClick={() => navigate("/")}>
                    Start Shopping
                  </Button>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border/40 bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider">
                  <Heart className="h-4 w-4 text-primary" /> Wishlist
                </h3>
                <Link to="/wishlist" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                  View All →
                </Link>
              </div>

              {wishlistItems.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
                  {wishlistItems.slice(0, 5).map((item) => (
                    <Link
                      key={item.id}
                      to={`/product/${item.id}`}
                      className="flex-shrink-0 w-28 rounded-xl border border-border/40 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="h-24 bg-muted/30 flex items-center justify-center">
                        <img src={item.image} alt={item.name} className="h-full w-full object-contain p-2" />
                      </div>
                      <div className="p-2">
                        <p className="text-[10px] font-semibold text-foreground truncate">{item.name}</p>
                        <p className="text-[10px] font-bold text-primary">Tk {item.price.toLocaleString()}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="mx-auto h-10 w-10 text-muted-foreground/30" />
                  <p className="mt-2 text-sm text-muted-foreground">Your wishlist is empty</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border/40 bg-card p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider">
                  <User className="h-4 w-4 text-primary" /> Profile
                </h3>
                {!editing ? (
                  <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs" onClick={() => { setEditForm(profile); setEditing(true); }}>
                    <Edit2 className="h-3 w-3" /> Edit
                  </Button>
                ) : (
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setEditing(false)}>
                      <X className="h-3 w-3" />
                    </Button>
                    <Button size="sm" className="h-8 gap-1 text-xs" onClick={handleSave}>
                      <Save className="h-3 w-3" /> Save
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm font-bold text-foreground">{profile.full_name || "Set your name"}</p>
              </div>

              {editing ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Full Name</Label>
                    <Input value={editForm.full_name} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} className="mt-1 rounded-xl" placeholder="Your name" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Phone</Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="pl-9 rounded-xl" placeholder="01XXXXXXXXX" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">City</Label>
                    <Input value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} className="mt-1 rounded-xl" placeholder="Dhaka" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Address</Label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3 top-3 h-3.5 w-3.5 text-muted-foreground" />
                      <textarea
                        value={editForm.address}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        rows={3}
                        className="w-full pl-9 rounded-xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="House, Road, Area"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 rounded-xl bg-muted/30 p-3">
                    <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Phone</p>
                      <p className="text-xs font-medium text-foreground">{profile.phone || "Not set"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl bg-muted/30 p-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Address</p>
                      <p className="text-xs font-medium text-foreground">
                        {profile.address ? `${profile.address}${profile.city ? `, ${profile.city}` : ""}` : "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
