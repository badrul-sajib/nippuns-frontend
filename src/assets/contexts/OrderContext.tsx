import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export type OrderStatus = "confirmed" | "processing" | "shipped" | "delivered";

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
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "status" | "createdAt" | "estimatedDelivery">) => Promise<string>;
  getOrder: (id: string) => Order | undefined;
  loading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const STORAGE_KEY = "nipuns_orders";

const getEstimatedDelivery = (zone: "inside" | "outside") => {
  const days = zone === "inside" ? 2 : 5;
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
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
  const [loading] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const addOrder = useCallback(async (orderData: Omit<Order, "id" | "status" | "createdAt" | "estimatedDelivery">) => {
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
    <OrderContext.Provider value={{ orders, addOrder, getOrder, loading }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrders must be used within OrderProvider");
  return context;
};
