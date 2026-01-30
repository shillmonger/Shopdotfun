"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  User,
  CreditCard,
  MapPin,
  Truck,
  Search,
  Filter,
  Lock,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ChevronRight,
  MoreHorizontal,
  ShieldCheck,
  Loader2,
  AlertCircle,
  Package,
} from "lucide-react";
import Link from "next/link";

import SellerHeader from "@/components/seller-dashboard/SellerHeader";
import SellerSidebar from "@/components/seller-dashboard/SellerSidebar";
import SellerNav from "@/components/seller-dashboard/SellerNav";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  discount: number;
  productCode: string;
  images: Array<{
    url: string;
    thumbnailUrl: string;
    publicId: string;
  }>;
  description: string;
  stock: number;
  shippingFee: number;
  processingTime: string;
}

interface Order {
  id: string;
  buyer: string;
  buyerEmail: string;
  date: string;
  shippingAddress?: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    country: string;
    isDefault: boolean;
  } | null;
  items: OrderItem[];
  total: number;
  paymentStatus: string;
  fulfillmentStatus:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  productInfo?: any;
  paymentInfo?: any;
}

const fetchOrders = async () => {
  const response = await fetch("/api/seller/orders");
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  const result = await response.json();
  return result.data || [];
};

export default function OrdersReceivedPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchOrdersData();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <SellerSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <SellerHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 pb-32">
          <div className="max-w-6xl mx-auto">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
              <div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                  Orders{" "}
                  <span className="text-primary tracking-normal not-italic">
                    HUB
                  </span>
                </h1>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3 flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3 text-primary" /> Multi-vendor
                  orders are split automatically
                </p>
              </div>

              <div className="flex w-full md:w-auto gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search Order ID or Buyer..."
                    className="w-full md:w-64 bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-xs font-bold outline-none focus:ring-2 ring-primary/20"
                  />
                </div>
                <button className="bg-card border border-border p-3 rounded-xl hover:bg-muted transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {loading ? (
                <div className="py-16 bg-card border-2 border-dashed border-border rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                  <Loader2 className="w-10 h-10 mb-3 animate-spin opacity-50" />
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-50">
                    Loading orders...
                  </p>
                </div>
              ) : error ? (
                <div className="py-16 bg-card border-2 border-dashed border-red-500/30 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                  <AlertCircle className="w-10 h-10 mb-3 text-red-500" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2">
                    Error loading orders
                  </p>
                  <p className="text-[9px] text-muted-foreground">{error}</p>
                </div>
              ) : orders.length === 0 ? (
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
                    No Placed Orders Yet
                  </h3>

                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest max-w-[250px] leading-relaxed">
                    No orders have been placed yet, keep pushing out your
                    content out there.
                  </p>

                  <Link
                    href="/general-dashboard/seller-dashboard/notifications"
                    className="mt-8 px-6 py-4 bg-foreground cursor-pointer text-background text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground transition-colors rounded-full"
                  >
                    Check Notifications
                  </Link>
                </div>
              ) : (
                orders.map((order) => {
                  const isPaid = order.paymentStatus === "Paid";

                  return (
                    <div
                      key={order.id}
                      className="bg-card border border-border rounded-3xl overflow-hidden hover:border-primary/40 transition-all group shadow-sm"
                    >
                      <div className="py-6 px-2 md:p-6">
                        {/* Top Row: IDs and Status */}
                        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 justify-center md:justify-start">
                              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                {order.id}
                              </span>
                              <span className="text-[10px] font-bold text-muted-foreground">
                                • {order.date}
                              </span>
                            </div>
                            <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 justify-center md:justify-start text-center md:text-left">
                              <User className="w-4 h-4 text-primary" />{" "}
                              {order.buyer}
                            </h3>
                          </div>

                          <div className="flex items-center gap-2 justify-center md:justify-start">
                            {/* Payment Status Buttons */}
                            <button
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest cursor-pointer transition-all ${
                                order.paymentStatus === "pending"
                                  ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                  : "bg-muted text-muted-foreground border-border cursor-not-allowed opacity-50"
                              }`}
                              onClick={() => {
                                // Only allow pending for now
                                if (order.paymentStatus !== "pending") return;
                                // TODO: Handle status change later
                              }}
                            >
                              <Clock className="w-3 h-3" />
                              Pending
                            </button>

                            <button
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest cursor-not-allowed opacity-50 transition-all ${
                                order.paymentStatus === "processing"
                                  ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                  : "bg-muted text-muted-foreground border-border"
                              }`}
                              disabled
                            >
                              <Loader2 className="w-3 h-3" />
                              Processing
                            </button>

                            <button
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest cursor-not-allowed opacity-50 transition-all ${
                                order.paymentStatus === "paid"
                                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                                  : "bg-muted text-muted-foreground border-border"
                              }`}
                              disabled
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              Paid
                            </button>
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="bg-background/50 rounded-2xl p-4 border border-border/50 space-y-4 mb-6">
                          {order.items.map((item, idx) => {
                            const discountedPrice =
                              item.price * (1 - item.discount / 100);
                            const itemTotal = discountedPrice * item.qty;

                            return (
                              <div key={idx} className="space-y-4">
                                {/* Product Header with All Images */}
                                <div className="flex flex-col sm:flex-row gap-4 p-2 sm:p-0">
                                  {/* Images Container: Stacks or wraps on very small screens */}
                                  <div className="flex flex-wrap gap-2 flex-shrink-0">
                                    {item.images &&
                                      item.images.length > 0 &&
                                      item.images
                                        .slice(0, 4)
                                        .map((image, imageIdx) => (
                                          <div
                                            key={imageIdx}
                                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border border-border"
                                          >
                                            <img
                                              src={image.thumbnailUrl}
                                              alt={`${item.name} ${imageIdx + 1}`}
                                              className="w-full h-full object-cover"
                                            />
                                          </div>
                                        ))}
                                  </div>

                                  {/* Content Container */}
                                  <div className="flex-1">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                      {/* Product Info */}
                                      <div className="space-y-1">
                                        <h4 className="font-bold uppercase text-sm leading-tight">
                                          {item.name}
                                        </h4>
                                        <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                                          <span className="font-mono bg-muted px-2 py-1 rounded">
                                            {item.productCode}
                                          </span>
                                          <span className="hidden xs:inline">
                                            •
                                          </span>
                                          <span>Qty: {item.qty}</span>
                                          <span>•</span>
                                          <span>Stock: {item.stock}</span>
                                        </div>
                                      </div>

                                      {/* Pricing: Aligns right on desktop, left on mobile for better flow */}
                                      <div className="text-left md:text-right border-t md:border-t-0 pt-2 md:pt-0">
                                        <div
                                          className={`text-[10px] font-bold ${item.discount > 0 ? "text-green-500" : "text-muted-foreground"}`}
                                        >
                                          {item.discount}% OFF
                                        </div>
                                        <div className="text-[10px] text-muted-foreground line-through">
                                          ${item.price.toFixed(2)} each
                                        </div>
                                        <div className="font-black italic text-lg md:text-base">
                                          ${discountedPrice.toFixed(2)}{" "}
                                          <span className="text-[10px] not-italic font-normal">
                                            each
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Additional Product Info */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[10px]">
                                  {/* Description - full width on mobile */}
                                  <div className="bg-muted/50 rounded-lg p-3">
                                    <p className="font-bold text-muted-foreground uppercase tracking-wider mb-1">
                                      Description
                                    </p>
                                    <p className="line-clamp-2">
                                      {item.description.length > 40 
                                        ? `${item.description.substring(0, 40)}...` 
                                        : item.description
                                      }
                                    </p>
                                  </div>

                                  {/* Mobile: 2 columns | Desktop: normal 3-col grid */}
                                  <div className="grid grid-cols-2 gap-3 md:contents">
                                    {/* Shipping */}
                                    <div className="bg-muted/50 rounded-lg p-3">
                                      <p className="font-bold text-muted-foreground uppercase tracking-wider mb-1">
                                        Shipping
                                      </p>
                                      <p>${item.shippingFee} fee</p>
                                      <p className="text-muted-foreground">
                                        {item.processingTime}
                                      </p>
                                    </div>

                                    {/* Shipping Address */}
                                    <div className="bg-muted/50 rounded-lg p-3">
                                      <p className="font-bold text-muted-foreground uppercase tracking-wider mb-1">
                                        Shipping Address
                                      </p>
                                      {order.shippingAddress ? (
                                        <div className="space-y-1">
                                          <p className="font-medium">{order.shippingAddress.fullName}</p>
                                          <p className="text-muted-foreground">{order.shippingAddress.street}</p>
                                          <p className="text-muted-foreground">
                                            {order.shippingAddress.city}, {order.shippingAddress.state}
                                          </p>
                                          <p className="text-muted-foreground">{order.shippingAddress.country}</p>
                                          <div className="flex items-center gap-1 mt-2">
                                            <MapPin className="w-3 h-3 text-primary" />
                                            <a 
                                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.country}`)}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-primary hover:underline font-medium"
                                            >
                                              View on Map
                                            </a>
                                          </div>
                                        </div>
                                      ) : (
                                        <p className="text-muted-foreground">No address available</p>
                                      )}
                                    </div>

                                    {/* Item Total */}
                                    <div className="bg-muted/50 rounded-lg p-3">
                                      <p className="font-bold text-muted-foreground uppercase tracking-wider mb-1">
                                        Item Total
                                      </p>
                                      <p className="font-black text-lg">
                                        ${itemTotal.toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Footer Row: Action & Total */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6 border-t border-border/50">
                          <div className="text-center md:text-left space-y-1">
                            {(() => {
                              const originalTotal = order.items.reduce(
                                (sum, item) => sum + item.price * item.qty,
                                0,
                              );

                              const discountedTotal = order.items.reduce(
                                (sum, item) => {
                                  const discountedPrice =
                                    item.price * (1 - item.discount / 100);
                                  return sum + discountedPrice * item.qty;
                                },
                                0,
                              );

                              const totalDiscount =
                                originalTotal - discountedTotal;

                              return (
                                <>
                                  {/* Main Price Row */}
                                  <div className="flex flex-col sm:flex-row sm:items-end sm:gap-3 justify-center md:justify-start">
                                    {/* Final Amount */}
                                    <p className="flex items-center justify-center text-2xl sm:text-3xl font-black italic tracking-tighter">
                                      ${discountedTotal.toFixed(2)}
                                    </p>

                                    {/* Discount Info */}
                                    {totalDiscount > 0 && (
                                      <div className="flex items-center justify-center gap-2 text-[11px]">
                                        <span className="text-muted-foreground line-through">
                                          ${originalTotal.toFixed(2)}
                                        </span>

                                        <span className="text-green-600 font-bold">
                                          -${totalDiscount.toFixed(2)}
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Label */}
                                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                                    Total Earnings
                                  </p>
                                </>
                              );
                            })()}
                          </div>

                          <div className="flex items-center gap-3 md:w-auto">
                            {isPaid ? (
                              <button className="flex-1 md:flex-none bg-primary cursor-pointer text-primary-foreground text-center px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                                Mark as Shipped <Truck className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                disabled
                                className="flex-1 md:flex-none bg-muted text-muted-foreground/50 border border-border px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 cursor-not-allowed"
                              >
                                Wait for Payment <Lock className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>

        <SellerNav />
      </div>
    </div>
  );
}
