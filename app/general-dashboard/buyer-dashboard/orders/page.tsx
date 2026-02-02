"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  ShieldCheck,
  User,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Truck,
  Timer,
  Search,
  Filter,
  Globe,
  Ban,
  CheckCircle2,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

import BuyerHeader from "@/components/buyer-dashboard/BuyerHeader";
import BuyerSidebar from "@/components/buyer-dashboard/BuyerSidebar";
import BuyerNav from "@/components/buyer-dashboard/BuyerNav";
import { useAuth } from "@/hooks/useAuth";
import {
  getShippingStatusLabel,
  getBuyerActionLabel,
  getShippingStatusColor,
  getBuyerActionColor,
  shouldHideBuyerAction,
  canBuyerAct,
  OrderStatus,
} from "@/lib/order-status";

/* ======================================================
TYPES - Updated to match backend Order model
====================================================== */

interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
}

interface ProductImage {
  url: string;
  thumbnailUrl: string;
  publicId: string;
  _id?: any;
}

interface ProductInfo {
  productCode: string;
  name: string;
  price: number;
  discount: number;
  quantity: number;
  images: ProductImage[];
  description: string;
  stock: number;
  shippingFee: number;
  processingTime: string;
}

interface SellerInfo {
  sellerName: string;
  sellerEmail: string;
  phoneNumber: string;
  country: string;
}

interface BuyerInfo {
  username: string;
  email: string;
  phoneNumber: string;
  shippingAddress: ShippingAddress;
}

interface PaymentInfo {
  amount: number;
  cryptoMethodUsed: string;
  cryptoAmount: string;
  cryptoAddress: string;
  paymentId: string;
}

interface Order {
  _id?: any;
  orderId: string;
  buyerInfo: BuyerInfo;
  productInfo: ProductInfo;
  sellerInfo: SellerInfo;
  status: OrderStatus;
  paymentInfo: PaymentInfo;
  createdAt: string | Date;
  updatedAt: string | Date;
}

/* ======================================================
COUNTDOWN COMPONENT
====================================================== */

const CountdownTimer = ({ deadline }: { deadline: string }) => {
  const [timeLeft, setTimeLeft] = useState("Loading...");

  useEffect(() => {
    const target = new Date(deadline).getTime();
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft("Expired");
        clearInterval(timer);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${days}d ${hours}h ${mins}m`);
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  return (
    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-primary/10 text-primary border border-primary/20">
      {timeLeft}
    </span>
  );
};

/* ======================================================
API FUNCTIONS
====================================================== */

async function fetchBuyerOrders(): Promise<{
  orders: Order[];
  stats: { pending: number; shipped: number; total: number };
}> {
  const response = await fetch("/api/buyer/orders");
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  const result = await response.json();
  return result.success
    ? result
    : { orders: [], stats: { pending: 0, shipped: 0, total: 0 } };
}

async function updateOrderStatus(
  orderId: string,
  updates: Partial<OrderStatus>,
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("/api/buyer/orders/update-status", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId, updates }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || "Failed to update status",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "Network error" };
  }
}

/* ======================================================
HELPER FUNCTIONS
====================================================== */

function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function calculateDeadline(processingTime: string): string {
  // Parse processing time like "1-2 Days" and add to current date
  const days = parseInt(processingTime.split("-")[0]) || 2;
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + days);
  return deadline.toISOString();
}

function getTotalAmount(order: Order): number {
  return order.productInfo.price + order.productInfo.shippingFee;
}

/* ======================================================
ORDER CARD – more compact version
====================================================== */

function OrderCard({
  order,
  problem,
  onProblemChange,
  onAction,
  onSubmit,
  onUpdateOrder,
}: {
  order: Order;
  problem: string;
  onProblemChange: (text: string) => void;
  onAction: (action: string) => void;
  onSubmit: () => void;
  onUpdateOrder: (orderId: string, updatedOrder: Order) => void;
}) {
  const mainImage = order.productInfo.images[0];
  const deadline = calculateDeadline(order.productInfo.processingTime);
  const totalAmount = getTotalAmount(order);
  const canAct = canBuyerAct(order.status);
  const shippingLabel = getShippingStatusLabel(order.status.shipping);
  const shippingColor = getShippingStatusColor(order.status.shipping);

  // Only show buyer action if not 'none'
  const buyerActionLabel = !shouldHideBuyerAction(order.status.buyerAction)
    ? getBuyerActionLabel(order.status.buyerAction)
    : null;
  const buyerActionColor = buyerActionLabel
    ? getBuyerActionColor(order.status.buyerAction)
    : null;

  return (
    <div className="bg-card border border-border rounded-3xl shadow-sm hover:border-primary/40 transition-all duration-300 overflow-hidden">
      <div className="p-5 md:p-7">
        {/* Header Row – tighter */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
              {order.orderId} <span className="mx-1.5 opacity-30">|</span>{" "}
              {formatDate(order.createdAt)}{" "}
              <span className="mx-1.5 opacity-30">|</span>{" "}
              <Link
                href={`/general-dashboard/buyer-dashboard/orders/order-tracking?orderId=${order.orderId}`}
                className="text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
              >
                <Truck className="w-3 h-3" />
                Track Order
                <ExternalLink className="w-3 h-3" />
              </Link>
            </p>
            <h3 className="mt-1 text-xl md:text-2xl font-black italic uppercase tracking-tight flex items-center gap-2.5">
              <Package className="w-5 h-5 text-primary" />
              {order.productInfo.name}
            </h3>
          </div>

          <div className="flex items-center justify-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-xl border border-border text-[9px]">
              <span className="font-black uppercase opacity-60 tracking-wider">
                Time
              </span>
              <span className="font-black uppercase text-primary">
                {order.productInfo.processingTime}
              </span>
            </div>
            <span
              className={`text-[9px] font-black uppercase px-3.5 py-1.5 rounded-xl tracking-wider ${shippingColor}`}
            >
              {shippingLabel}
            </span>
            {buyerActionLabel && buyerActionColor && (
              <span
                className={`text-[9px] font-black uppercase px-3.5 py-1.5 rounded-xl tracking-wider ${buyerActionColor}`}
              >
                {buyerActionLabel}
              </span>
            )}
          </div>
        </div>

        {/* Main Content – smaller image + tighter grid */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* Image – smaller */}
          <div className="relative w-full lg:w-44 shrink-0 flex justify-center">
            <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-2 border-card shadow-xl z-10">
              <img
                src={mainImage?.url || "/placeholder.png"}
                alt={order.productInfo.name}
                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition duration-400"
              />
            </div>
          </div>

          {/* Info – tighter spacing */}
          <div className="flex-1 grid sm:grid-cols-2 gap-5">
            {/* Seller */}
            <div className="bg-muted/30 rounded-2xl p-5 border border-border/40 hover:bg-muted/50 transition">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-3 flex items-center gap-1.5">
                <User className="w-4 h-4" /> Seller
              </p>
              <p className="font-black italic uppercase text-base mb-2.5">
                {order.sellerInfo.sellerName}
              </p>
              <div className="space-y-1.5 text-[10px] font-bold text-muted-foreground uppercase">
                <p className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 opacity-60" />{" "}
                  {order.sellerInfo.country}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 opacity-60" />{" "}
                  {order.sellerInfo.phoneNumber}
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 opacity-60" />{" "}
                  {order.sellerInfo.sellerEmail}
                </p>
              </div>
            </div>

            {/* Delivery */}
            <div className="bg-muted/30 rounded-2xl p-5 border border-border/40">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-3 flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> Shipping To
              </p>
              <p className="font-black text-sm uppercase mb-1">
                {order.buyerInfo.shippingAddress.fullName}
              </p>
              <p className="text-[10px] font-bold italic uppercase text-muted-foreground leading-snug">
                {order.buyerInfo.shippingAddress.country} ,{" "}
                {order.buyerInfo.shippingAddress.city},{" "}
                {order.buyerInfo.shippingAddress.state}
                <br />
                {order.buyerInfo.shippingAddress.street},<br />
              </p>
              <p className="mt-1.5 text-[10px] font-black text-primary">
                {order.buyerInfo.shippingAddress.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Price + Actions – smaller buttons */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div className="text-center sm:text-left">
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-0.5">
              Amount Paid
            </p>
            <p className="text-4xl font-black italic tracking-tight">
              ${totalAmount.toFixed(2)}
            </p>
          </div>

          <div className="flex gap-3 w-full sm:w-auto flex-wrap">
            {canAct && (
              <>
                <button
                  onClick={() => onAction("Received")}
                  className="flex-1 sm:flex-none bg-green-600 cursor-pointer text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-md hover:brightness-110"
                >
                  <CheckCircle2 className="w-4 h-4" /> Received
                </button>
                <button
                  onClick={() => onAction("Delayed")}
                  className="flex-1 sm:flex-none bg-amber-500 cursor-pointer text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-md hover:brightness-110"
                >
                  <Timer className="w-4 h-4" /> Delay
                </button>
                <button
                  onClick={() => onAction("Damaged")}
                  className="flex-1 sm:flex-none bg-red-600 cursor-pointer text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-md hover:brightness-110"
                >
                  <Ban className="w-4 h-4" /> Damaged
                </button>
              </>
            )}
            <Link
              href={`/general-dashboard/buyer-dashboard/orders/disputes?orderId=${order.orderId}`}
              className="flex-1 sm:flex-none bg-card border border-border cursor-pointer text-foreground px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-md hover:bg-muted hover:border-primary/40 transition-colors"
            >
              Disputes
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>


      </div>
    </div>
  );
}

/* ======================================================
MAIN PAGE – BuyerNav moved to top
====================================================== */

export default function BuyerOrdersPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [problems, setProblems] = useState<Record<string, string>>({});
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch orders on component mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchBuyerOrders();
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Failed to load orders:", err);
        setError("Failed to load orders. Please try again.");
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Count orders by status
  const pendingCount = orders.filter(
    (order) => order.status.shipping === "pending",
  ).length;
  const shippedCount = orders.filter(
    (order) => order.status.shipping === "shipped",
  ).length;

  // Filter orders based on search term
  const filteredOrders = orders.filter(
    (order) =>
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productInfo.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAction = async (orderId: string, action: string) => {
    let updates: Partial<OrderStatus> = {};

    switch (action) {
      case "Received":
        updates = { buyerAction: "received" };
        break;
      case "Delayed":
        updates = { buyerAction: "delayed" };
        break;
      case "Damaged":
        updates = { buyerAction: "damaged" };
        break;
      default:
        return;
    }

    const result = await updateOrderStatus(orderId, updates);

    if (result.success) {
      toast.success(`${action} action completed successfully`);

      // Update the local order state
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.orderId === orderId) {
            const updatedOrder = { ...order };
            if (updates.buyerAction) {
              updatedOrder.status.buyerAction = updates.buyerAction;
            }
            if (updates.buyerAction === "received") {
              updatedOrder.status.shipping = "received";
            }
            updatedOrder.updatedAt = new Date();
            return updatedOrder;
          }
          return order;
        }),
      );
    } else {
      toast.error(result.error || "Failed to update order");
    }
  };

  const submitProblem = (orderId: string) => {
    if (!problems[orderId]) {
      toast.error("Description required");
      return;
    }
    toast.success("Case Opened", {
      description: "Support will contact you soon.",
    });
    setProblems((p) => ({ ...p, [orderId]: "" }));
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <BuyerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <BuyerHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Moved nav here – now appears right after header */}
        <BuyerNav />

        <main className="flex-1 pb-32 overflow-y-auto p-4 md:p-6 lg:p-10">
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Search / Filter bar */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-5 border-b border-border pb-2">
              <div className="w-full md:w-auto">
                <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
                  My <span className="text-primary not-italic">Orders</span>
                </h1>
                <p className="mt-3 text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2 tracking-[0.3em]">
                  <ShieldCheck className="w-4 h-4 text-green-600" /> Secure
                  Escrow Active
                </p>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    placeholder="FIND ORDER ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-64 pl-10 pr-4 h-9 rounded-lg border bg-card text-[10px] font-black uppercase tracking-widest focus:ring-2 ring-primary/20 outline-none"
                  />
                </div>
                <button className="border h-9 w-9 flex items-center justify-center rounded-lg hover:bg-muted transition cursor-pointer group">
                  <Filter className="w-4 h-4 group-hover:text-primary transition" />
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="text-sm font-medium">
                    Loading your orders...
                  </span>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <p className="text-red-800 font-medium">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredOrders.length === 0 && (
              <div className="text-center py-20 px-4 border-2 border-dashed border-border rounded-3xl bg-muted/30 flex flex-col items-center justify-center relative overflow-hidden">
                {/* Background Decorative Element */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -z-10" />

                <div className="relative mb-6 group">
                  <img
                    src="https://i.postimg.cc/LXSKYHG4/empty-box-removebg-preview.png"
                    alt="Empty Box"
                    className="w-40 h-40 object-contain cursor-pointer grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-out"
                  />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary/20 blur-sm rounded-full" />
                </div>

                <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">
                  No orders found
                </h3>

                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest max-w-[250px] leading-relaxed">
                  You haven't placed any orders yet, Add your first Product to
                  Cart and Checkout.
                </p>

                <Link
                  href="/general-dashboard/seller-dashboard/browse-product"
                  className="mt-8 px-6 py-4 bg-foreground cursor-pointer text-background text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground transition-colors rounded-full"
                >
                  Browse Products
                </Link>
              </div>
            )}

            {/* Orders */}
            {!loading && !error && filteredOrders.length > 0 && (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <OrderCard
                    key={order.orderId}
                    order={order}
                    problem={problems[order.orderId] || ""}
                    onProblemChange={(v) =>
                      setProblems({ ...problems, [order.orderId]: v })
                    }
                    onAction={(a) => handleAction(order.orderId, a)}
                    onSubmit={() => submitProblem(order.orderId)}
                    onUpdateOrder={(orderId, updatedOrder) => {
                      setOrders((prevOrders) =>
                        prevOrders.map((order) =>
                          order.orderId === orderId ? updatedOrder : order,
                        ),
                      );
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
