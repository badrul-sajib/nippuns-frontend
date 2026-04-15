import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { placeOrder as apiPlaceOrder, fetchOrders as apiFetchOrders } from "@/api/orders";

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export type OrderStatus = "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  name: string;
  phone: string;
  address: string;
  deliveryZone: "inside" | "outside";
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
  couponCode?: string;
  couponDiscount?: number;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "status" | "createdAt" | "estimatedDelivery">, apiPayload?: any) => Promise<string>;
  getOrder: (id: string) => Order | undefined;
  loading: boolean;
  refreshOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const STORAGE_KEY = "nipuns_orders";

const isLoggedIn = () => !!localStorage.getItem("auth_token");

const getEstimatedDelivery = (zone: "inside" | "outside") => {
  const days = zone === "inside" ? 2 : 5;
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

// Normalize API order to local Order shape
const normalizeApiOrder = (apiOrder: any): Order => {
  const deliveryZone: "inside" | "outside" =
    apiOrder.delivery_zone === "outside" || apiOrder.shipping_district?.toLowerCase() !== "dhaka"
      ? "outside"
      : "inside";

  const items: OrderItem[] = (apiOrder.items || apiOrder.order_items || []).map((item: any) => ({
    id: String(item.product_id || item.id || ""),
    name: item.product?.name || item.name || "",
    image: item.product?.images?.[0] || item.image || "",
    price: Number(item.unit_price || item.price) || 0,
    quantity: Number(item.quantity) || 1,
  }));

  const statusMap: Record<string, OrderStatus> = {
    pending: "confirmed",
    confirmed: "confirmed",
    processing: "processing",
    shipped: "shipped",
    delivered: "delivered",
    cancelled: "cancelled",
  };

  return {
    id: apiOrder.order_number || String(apiOrder.id),
    items,
    subtotal: Number(apiOrder.subtotal) || 0,
    shippingCost: Number(apiOrder.shipping_cost || apiOrder.shippingCost) || 0,
    total: Number(apiOrder.total) || 0,
    name: apiOrder.customer_name || apiOrder.shipping_name || apiOrder.name || "",
    phone: apiOrder.customer_phone || apiOrder.shipping_phone || apiOrder.phone || "",
    address: apiOrder.shipping_address || apiOrder.address || "",
    deliveryZone,
    paymentMethod: apiOrder.payment_method || "cod",
    status: statusMap[apiOrder.status] || "confirmed",
    createdAt: apiOrder.created_at || new Date().toISOString(),
    estimatedDelivery: apiOrder.estimated_delivery || getEstimatedDelivery(deliveryZone),
    couponCode: apiOrder.coupon_code,
    couponDiscount: Number(apiOrder.discount_amount) || 0,
  };
};

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);

  // Persist local orders to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const refreshOrders = useCallback(async () => {
    if (!isLoggedIn()) return;
    try {
      setLoading(true);
      const data = await apiFetchOrders();
      const apiOrders = (data.data || data || []).map(normalizeApiOrder);
      setOrders(apiOrders);
    } catch {
      // Keep local orders on error
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch orders from API on mount if logged in
  useEffect(() => {
    if (isLoggedIn()) {
      refreshOrders();
    }
  }, [refreshOrders]);

  const addOrder = useCallback(async (
    orderData: Omit<Order, "id" | "status" | "createdAt" | "estimatedDelivery">,
    apiPayload?: any
  ) => {
    if (isLoggedIn() && apiPayload) {
      try {
        setLoading(true);
        const response = await apiPlaceOrder(apiPayload);
        const apiOrder = response.data || response.order || response;
        const normalized = normalizeApiOrder(apiOrder);
        setOrders((prev) => [normalized, ...prev]);
        return normalized.id;
      } catch (err: any) {
        // Fall through to local order if API fails
        const errMsg = err?.response?.data?.message || "Failed to place order via API";
        throw new Error(errMsg);
      } finally {
        setLoading(false);
      }
    }

    // Guest / offline fallback: create local order
    const id = `ORD-${Date.now().toString(36).toUpperCase()}`;
    const order: Order = {
      ...orderData,
      id,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      estimatedDelivery: getEstimatedDelivery(orderData.deliveryZone),
    };
    setOrders((prev) => [order, ...prev]);
    return id;
  }, []);

  const getOrder = useCallback((id: string) => {
    return orders.find((o) => o.id === id);
  }, [orders]);

  return (
    <OrderContext.Provider value={{ orders, addOrder, getOrder, loading, refreshOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrders must be used within OrderProvider");
  return context;
};
