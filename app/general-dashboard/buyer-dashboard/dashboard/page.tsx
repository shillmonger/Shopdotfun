"use client";

import React, { useState, useEffect } from "react";
import {
  Truck,
  Package,
  CheckCircle2,
  CreditCard,
  AlertCircle,
  ChevronRight,
  ShoppingCart,
  PiggyBank,
  ArrowRight,
  MapPin,
  Bell,
  HelpCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { getGreeting } from "@/lib/utils";
import { toast } from 'sonner';

import BuyerHeader from "@/components/buyer-dashboard/BuyerHeader";
import BuyerSidebar from "@/components/buyer-dashboard/BuyerSidebar";
import BuyerNav from "@/components/buyer-dashboard/BuyerNav";
import { convertToCrypto } from "@/lib/crypto-converter";

// Helper function to calculate time ago
const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return `${Math.floor(diffInSeconds / 604800)}w ago`;
};

interface UserData {
  name: string;
  email: string;
  country?: string;
  image?: string;
}

export default function BuyerOverviewPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [cartItemsCount, setCartItemsCount] = useState<number>(0);
  const [orderStats, setOrderStats] = useState<{
    active: number;
    received: number;
  }>({ active: 0, received: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [shippedOrder, setShippedOrder] = useState<any>(null);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [paymentNotifications, setPaymentNotifications] = useState<any[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cryptoPrices, setCryptoPrices] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile data
        const profileResponse = await fetch("/api/buyer/profile");
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setUserData({
            name: profileData.name || "User",
            email: profileData.email,
            country: profileData.country || "Unknown Location",
            image: profileData.image,
          });
          setUserBalance(profileData.userBalance || 0);
          
          // Process payment history for notifications
          if (profileData.paymentHistory && profileData.paymentHistory.length > 0) {
            // Sort payments by approvedAt date (most recent first)
            const sortedPayments = profileData.paymentHistory.sort((a: any, b: any) => 
              new Date(b.approvedAt).getTime() - new Date(a.approvedAt).getTime()
            );
            
            // Get the 2 most recent payments
            const recentTwoPayments = sortedPayments.slice(0, 2);
            
            // Create notification messages for recent payments
            const notifications = recentTwoPayments.map((payment: any) => {
              const paymentDate = new Date(payment.approvedAt);
              const timeAgo = getTimeAgo(paymentDate);
              const cryptoMethod = payment.cryptoMethod ? payment.cryptoMethod.toUpperCase() : '';
              
              return {
                title: "Payment Received",
                desc: `You just got paid $${payment.amountPaid?.toFixed(2) || '0.00'} ${cryptoMethod ? `via ${cryptoMethod}` : ''}`,
                time: timeAgo,
                amount: payment.amountPaid,
                cryptoMethod: payment.cryptoMethod
              };
            });
            
            setPaymentNotifications(notifications);
          }
        }

        // Fetch cart data
        const cartResponse = await fetch("/api/buyer/cart");
        if (cartResponse.ok) {
          const cartData = await cartResponse.json();
          setCartItemsCount(cartData.items?.length || 0);
        }

        // Fetch order statistics
        const ordersResponse = await fetch("/api/buyer/orders");
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setOrderStats({
            active: ordersData.stats?.pending || 0,
            received: ordersData.stats?.shipped || 0,
          });
        }

        // Fetch recent orders
        const recentOrdersResponse = await fetch("/api/buyer/recent-orders");
        if (recentOrdersResponse.ok) {
          const recentOrdersData = await recentOrdersResponse.json();
          setRecentOrders(recentOrdersData.recentOrders || []);
        }

        // Fetch shipped order for attention section
        const shippedOrderResponse = await fetch("/api/buyer/shipped-order");
        if (shippedOrderResponse.ok) {
          const shippedOrderData = await shippedOrderResponse.json();
          setShippedOrder(shippedOrderData.shippedOrder);
        }

        // Fetch recent payments for wallet summary
        const recentPaymentsResponse = await fetch(
          "/api/buyer/recent-payments",
        );
        if (recentPaymentsResponse.ok) {
          const recentPaymentsData = await recentPaymentsResponse.json();
          setRecentPayments(recentPaymentsData.recentPayments || []);
        }

        // Fetch recommended products for "You Might Like" section
        const sessionId = sessionStorage.getItem('recommendedSessionId') || Date.now().toString();
        sessionStorage.setItem('recommendedSessionId', sessionId);
        
        const recommendedResponse = await fetch(`/api/buyer/recommended-products?sessionId=${sessionId}`);
        if (recommendedResponse.ok) {
          const recommendedData = await recommendedResponse.json();
          const products = recommendedData.products || [];
          setRecommendedProducts(products);
          
          // Convert prices to crypto for products that have crypto field
          const priceConversions: {[key: string]: string} = {};
          for (const product of products) {
            if (product.crypto && product.crypto !== 'USD') {
              const discountedPrice = product.price * (1 - product.discount / 100);
              const cryptoPrice = await convertToCrypto(discountedPrice, product.crypto);
              priceConversions[product._id] = cryptoPrice;
            }
          }
          setCryptoPrices(priceConversions);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add to cart function
  const addToCart = async (product: any) => {
    try {
      const response = await fetch('/api/buyer/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product._id,
          productName: product.name,
          sellerName: product.sellerName,
          price: product.price,
          discount: product.discount || 0,
          stock: product.stock,
          shippingFee: product.shippingFee || 0,
          image: product.images?.[0]?.url || '',
          quantity: 1
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Added to cart successfully!');
        setCartItemsCount(data.items?.length || 0);
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } else {
        if (response.status === 401) {
          toast.error('Please login to add items to cart');
        } else {
          toast.error(data.error || 'Failed to add to cart');
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  // Dynamic Stats
  const stats = [
    {
      label: "My Balance",
      value: loading ? "" : `$${userBalance?.toFixed(2) || "0.00"}`,
      loading: loading,
      icon: PiggyBank,
      link: "/general-dashboard/buyer-dashboard/payments",
    },
    {
      label: "Items in Cart",
      value: loading ? "" : cartItemsCount.toString(),
      loading: loading,
      icon: ShoppingCart,
      link: "/general-dashboard/buyer-dashboard/cart",
    },
    {
      label: "Active Orders",
      value: loading ? "" : orderStats.active.toString(),
      loading: loading,
      icon: Clock,
      link: "/general-dashboard/buyer-dashboard/orders",
    },
    {
      label: "Shipped Orders",
      value: loading ? "" : orderStats.received.toString(),
      loading: loading,
      icon: Truck,
      link: "/general-dashboard/buyer-dashboard/orders",
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <BuyerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <BuyerHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-10">
            {/* 1️⃣ Welcome & Account Snapshot */}
            <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic leading-none">
                  {loading ? (
                    <div className="h-10 w-64 bg-muted rounded animate-pulse"></div>
                  ) : (
                    getGreeting(userData?.name || "User")
                  )}
                </h1>
                <div className="flex items-center gap-4 mt-3">
                  {loading ? (
                    <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      <MapPin className="w-3 h-3" /> How is{" "}
                      {userData?.country || "Unknown Location"} doing today?
                    </span>
                  )}
                </div>
              </div>
              <Link
                href="/general-dashboard/buyer-dashboard/browse-product"
                className="bg-primary text-primary-foreground px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 w-full md:w-auto block text-center"
              >
                Start Shopping
              </Link>
            </section>

            {/* 2️⃣ Quick Stats Summary */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <Link
                  key={i}
                  href={stat.link}
                  className="bg-card border border-border p-5 rounded-2xl group hover:border-primary transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {stat.loading ? (
                    <div className="h-8 w-16 bg-muted rounded animate-pulse mb-1"></div>
                  ) : (
                    <p className="text-xl sm:text-2xl md:text-3xl font-black italic tracking-tighter mb-1">
                      {stat.value}
                    </p>
                  )}
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                    {stat.label}
                  </p>
                </Link>
              ))}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Orders & Actions */}
              <div className="lg:col-span-8 space-y-10">
                {/* 4️⃣ Orders That Need Action (Alerts) */}
                <section className="space-y-4">
                  <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-primary" /> Attention
                    Required
                  </h2>
                  {shippedOrder ? (
                    <div className="bg-foreground text-background p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
                      {/* Left Section */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 min-w-0 w-full">
                        {/* Product Image */}
                        <div className="w-20 h-20 sm:w-16 sm:h-16 bg-muted cursor-pointer rounded-2xl overflow-hidden shrink-0 border-2 border-black dark:border-white box-border p-[2px]">
                          {shippedOrder.productInfo?.images?.[0]?.url ? (
                            <img
                              src={shippedOrder.productInfo.images[0].url}
                              alt={shippedOrder.productInfo.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-8 h-8 text-foreground/50" />
                            </div>
                          )}
                        </div>

                        {/* Text Content */}
                        <div className="min-w-0 w-full">
                          {/* Order ID */}
                          <p className="text-xs font-black uppercase tracking-widest opacity-70 sm:truncate">
                            Order #{shippedOrder.orderId}
                          </p>

                          {/* Title */}
                          <h3 className="text-sm font-black uppercase italic tracking-tighter sm:truncate">
                            {shippedOrder.productInfo?.name || "Product"} has
                            been shipped
                          </h3>

                          {/* Date */}
                          <p className="text-[10px] font-medium opacity-60 mt-1 uppercase sm:truncate">
                            Track your delivery – shipped on{" "}
                            {new Date(
                              shippedOrder.updatedAt,
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Button */}
                      <Link
                        href="/general-dashboard/buyer-dashboard/orders"
                        className="w-full md:w-auto bg-background text-foreground px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-center"
                      >
                        Track Order
                      </Link>
                    </div>
                  ) : (
                    <div className="bg-card border border-border p-6 rounded-3xl text-center">
                      <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm font-black uppercase tracking-tighter mb-2">
                        No shipped orders
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase">
                        Your shipped orders will appear here
                      </p>
                    </div>
                  )}
                </section>

                {/* 3️⃣ Recent Orders Section */}
                <section className="space-y-4">
                  <div className="flex justify-between items-end">
                    <h2 className="text-sm font-black uppercase tracking-widest">
                      Recent Orders
                    </h2>
                    <Link
                      href="/general-dashboard/buyer-dashboard/orders"
                      className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="bg-card border border-border rounded-3xl overflow-hidden divide-y divide-border">
                    {loading ? (
                      // Loading skeleton
                      [1, 2].map((_, i) => (
                        <div
                          key={i}
                          className="p-5 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-muted rounded-xl animate-pulse"></div>
                            <div className="space-y-2">
                              <div className="h-4 w-48 bg-muted rounded animate-pulse"></div>
                              <div className="h-3 w-32 bg-muted rounded animate-pulse"></div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="h-6 w-16 bg-muted rounded-full animate-pulse"></div>
                            <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
                          </div>
                        </div>
                      ))
                    ) : recentOrders.length > 0 ? (
                      recentOrders.map((order, i) => (
                        <div
                          key={i}
                          className="p-5 flex items-center justify-between hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 sm:w-12 sm:h-12 bg-muted rounded-lg sm:rounded-xl overflow-hidden">
                              {order.productImage ? (
                                <img
                                  src={order.productImage}
                                  alt={order.productName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center font-black text-xs">
                                  IMG
                                </div>
                              )}
                            </div>

                            <div>
                              <p className="text-sm font-black uppercase italic tracking-tighter">
                                {order.productName}
                              </p>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase">
                                {order.orderId} •{" "}
                                {new Date(order.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="hidden md:flex items-center gap-4">
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-1 rounded-full border ${
                                order.status === "shipped"
                                  ? "border-amber-500/20 bg-amber-500/10 text-amber-500"
                                  : order.status === "pending"
                                    ? "border-blue-500/20 bg-blue-500/10 text-blue-500"
                                    : "border-green-500/20 bg-green-500/10 text-green-500"
                              }`}
                            >
                              {order.status === "shipped"
                                ? "Shipped"
                                : order.status === "pending"
                                  ? "Pending"
                                  : order.status === "received"
                                    ? "Received"
                                    : order.status}
                            </span>

                            <p className="font-black italic">
                              ${order.price.toFixed(2)}
                            </p>

                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                      ))
                    ) : (
                      // No orders state
                      <div className="p-8 text-center">
                        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm font-black uppercase tracking-tighter mb-2">
                          No orders yet
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase mb-4">
                          Start shopping to see your orders here
                        </p>
                        <Link
                          href="/general-dashboard/buyer-dashboard/browse-product"
                          className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                        >
                          Start Shopping
                        </Link>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* Right Column: Wallet & Notifications */}
              <div className="lg:col-span-4 space-y-8">
                {/* 6️⃣ Wallet / Payment Summary */}
                <section className="bg-card border border-border rounded-3xl p-6">
                  <h2 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" /> Payment
                    Summary
                  </h2>
                  <div className="space-y-4">
                    {loading ? (
                      // Loading skeleton
                      [1, 2].map((_, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-muted-foreground font-medium">
                            <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                          </span>
                          <span className="font-black">
                            <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
                          </span>
                        </div>
                      ))
                    ) : recentPayments.length > 0 ? (
                      recentPayments.map((payment, index) => (
                        <div
                          key={payment._id}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-muted-foreground font-medium">
                            {index === 0 ? "Last Payment" : "Previous Payment"}
                          </span>
                          <span
                            className={`font-black ${
                              payment.status === "approved"
                                ? "text-green-500"
                                : payment.status === "pending"
                                  ? "text-yellow-500"
                                  : "text-foreground"
                            }`}
                          >
                            $
                            {payment.buyerInfo?.amountToPay?.toFixed(2) ||
                              "0.00"}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <PiggyBank className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm font-black uppercase tracking-tighter mb-2">
                          No payments yet
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase">
                          Your payments history will appear here
                        </p>
                      </div>
                    )}
                    <Link
                      href="/general-dashboard/buyer-dashboard/payments"
                      className="block w-full text-center py-3 border border-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-colors mt-4"
                    >
                      View Payment Ledger
                    </Link>
                  </div>
                </section>



                {/* 7️⃣ Notifications Panel */}
                <section className="bg-card border border-border rounded-3xl p-6">
                  <h2 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-primary" /> Notifications
                  </h2>
                  <div className="space-y-6">
                    {loading ? (
                      // Loading skeleton for notifications
                      [1, 2].map((_, i) => (
                        <div key={i} className="flex gap-3 relative">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0 animate-pulse" />
                          <div className="flex-1">
                            <div className="h-4 w-24 bg-muted rounded animate-pulse mb-2"></div>
                            <div className="h-3 w-48 bg-muted rounded animate-pulse mb-1"></div>
                            <div className="h-3 w-16 bg-muted rounded animate-pulse"></div>
                          </div>
                        </div>
                      ))
                    ) : paymentNotifications.length > 0 ? (
                      paymentNotifications.map((notification, i) => (
                        <div key={i} className="flex gap-3 relative">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          <div>
                            <p className="text-[11px] font-black uppercase tracking-tight">
                              {notification.title}
                            </p>
                            <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                              {notification.desc}
                            </p>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm font-black uppercase tracking-tighter mb-2">
                          No notifications
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase">
                          Your payment notifications will appear here
                        </p>
                      </div>
                    )}
                  </div>
                </section>

                {/* 8️⃣ Help & Support Shortcut */}
                <section className="bg-primary/5 border border-primary/20 rounded-3xl p-6">
                  <HelpCircle className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-sm font-black uppercase italic tracking-tighter">
                    Need Assistance?
                  </h3>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase mt-2 leading-relaxed">
                    Our support team is available 24/7 for disputes or
                    questions.
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-6">
                    <Link
                      href="#"
                      className="bg-foreground text-background text-center py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:opacity-90"
                    >
                      Open Dispute
                    </Link>
                    <button className="border border-border text-center py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-background">
                      Help Center
                    </button>
                  </div>
                </section>
              </div>
            </div>

            {/* 5️⃣ You Might Like*/}
            <section className="pt-10 border-t border-border">
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-xl font-black uppercase italic tracking-tighter">
                  You Might Like
                </h2>
                <Link
                  href="/general-dashboard/buyer-dashboard/browse-product"
                  className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1 group"
                >
                  Explore More{" "}
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {loading ? (
                  // Loading skeleton
                  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, i) => (
                    <div
                      key={i}
                      className="bg-card border border-border rounded-2xl p-3 animate-pulse"
                    >
                      <div className="aspect-square bg-muted rounded-xl mb-3"></div>
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded mb-2"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-4 w-16 bg-muted rounded"></div>
                        <div className="h-8 w-8 bg-muted rounded"></div>
                      </div>
                    </div>
                  ))
                ) : recommendedProducts.length > 0 ? (
                  recommendedProducts.map((product, i) => (
                    <div
                      key={product._id || i}
                      className="bg-card border border-border rounded-2xl p-3 hover:shadow-xl transition-all group cursor-pointer"
                    >
                      <div className="aspect-square bg-muted rounded-xl mb-3 overflow-hidden relative">
                        {product.images?.[0]?.url ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] font-black uppercase opacity-20">
                            No Image
                          </div>
                        )}
                        {product.discount > 0 && (
                          <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-[9px] font-black">
                            -{product.discount}%
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] font-black text-primary uppercase mb-1 truncate">
                        {product.sellerName}
                      </p>
                      <p className="text-xs font-bold truncate mb-1" title={product.name}>
                        {product.name}
                      </p>
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                          <span
                            key={starIndex}
                            className={`text-[8px] ${
                              starIndex < Math.floor(product.averageRating || 0)
                                ? 'text-yellow-500'
                                : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="text-[8px] text-muted-foreground ml-1">
                          ({product.totalRatings || 0})
                        </span>
                      </div>

                      {/* Price and Cart Icon Container */}
                      <div className="flex items-center justify-between mt-2">
                        <div>
                          {product.discount > 0 && (
                            <p className="text-[9px] text-muted-foreground line-through font-bold">
                              ${product.price.toFixed(2)}
                            </p>
                          )}
                          <p className="text-sm font-black italic">
                            {product.crypto && product.crypto !== 'USD' && cryptoPrices[product._id]
                              ? cryptoPrices[product._id]
                              : `$${(product.price * (1 - product.discount / 100)).toFixed(2)}`
                            }
                          </p>
                        </div>
                        <button
                          onClick={() => addToCart(product)}
                          className="p-2 bg-primary text-primary-foreground cursor-pointer rounded-lg transition-opacity hover:scale-110 active:scale-95"
                          title="Add to Cart"
                          disabled={product.stock <= 0}
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {product.stock <= 0 && (
                        <p className="text-[9px] text-destructive font-black text-center mt-2">
                          Out of Stock
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  // No products state
                  <div className="col-span-full text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm font-black uppercase tracking-tighter mb-2">
                      No products available
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase">
                      Check back later for new recommendations
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>

        <BuyerNav />
      </div>
    </div>
  );
}
