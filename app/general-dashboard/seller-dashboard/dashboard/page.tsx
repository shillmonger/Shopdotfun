"use client";

import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Package,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  TrendingUp,
  ChevronRight,
  Truck,
  AlertCircle,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";

import { getGreeting, getDayGreeting } from "@/lib/utils";
import SellerHeader from "@/components/seller-dashboard/SellerHeader";
import SellerSidebar from "@/components/seller-dashboard/SellerSidebar";
import SellerNav from "@/components/seller-dashboard/SellerNav";

interface UserData {
  name: string;
  email: string;
  country?: string;
  image?: string;
}

export default function SellerOverviewPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [paginationInfo, setPaginationInfo] = useState<any>(null);
  const [stats, setStats] = useState([
    {
      label: "Total Sales",
      value: "$0",
      icon: DollarSign,
      trend: "+12%",
      href: "/general-dashboard/seller-dashboard/analytics",
    },
    {
      label: "Can Withdraw",
      value: "$0",
      icon: CheckCircle2,
      trend: "Ready",
      href: "/general-dashboard/seller-dashboard/request-payout",
    },
    {
      label: "Pending Ship",
      value: "0",
      icon: Clock,
      trend: "Urgent",
      href: "/general-dashboard/seller-dashboard/orders-management",
    },
    {
      label: "Orders Today",
      value: "0",
      icon: Package,
      trend: "+",
      href: "/general-dashboard/seller-dashboard/orders-management",
    }
  ]);
  const [statsLoading, setStatsLoading] = useState(true);


  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await fetch("/api/seller/stats");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const { totalSales, canWithdraw, ordersToday, pendingShip } = data.data;
          
          setStats([
            {
              label: "Total Sales",
              value: `$${totalSales.toFixed(2)}`,
              icon: DollarSign,
              trend: "+12%",
              href: "/dashboard/sales",
            },
            {
              label: "Can Withdraw",
              value: `$${canWithdraw.toFixed(2)}`,
              icon: CheckCircle2,
              trend: "Ready",
              href: "/dashboard/withdraw",
            },
            {
              label: "Pending Ship",
              value: pendingShip.toString(),
              icon: Clock,
              trend: "Urgent",
              href: "/dashboard/shipments/pending",
            },
            {
              label: "Orders Today",
              value: ordersToday.toString(),
              icon: Package,
              trend: "+",
              href: "/dashboard/orders",
            }
          ]);
        }
      } else {
        console.error("Failed to fetch stats");
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await fetch("/api/seller/orders/recent?limit=10");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Transform the data to match the frontend format
          const transformedOrders = data.data.map((order: any) => ({
            id: order.id,
            buyer: order.buyer,
            country: order.shippingAddress?.country || "N/A",
            productCode: order.items[0]?.productCode || "N/A",
            image:
              order.items[0]?.images?.[0]?.thumbnailUrl ||
              "/api/placeholder/40/40",
            total: order.total,
            status:
              order.status?.shipping === "pending"
                ? "Pending"
                : order.status?.shipping === "shipped"
                  ? "Shipped"
                  : "Delivered",
          }));
          setRecentOrders(transformedOrders);
          setPaginationInfo(data.pagination);
        }
      } else {
        console.error("Failed to fetch recent orders");
      }
    } catch (error) {
      console.error("Error fetching recent orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/seller/profile");
        if (response.ok) {
          const data = await response.json();
          setUserData({
            name: data.name || "Seller",
            email: data.email,
            country: data.country,
            image: data.image,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchStats();
    fetchRecentOrders();

    // Check wallet connection status
    const checkWalletStatus = async () => {
      try {
        const response = await fetch("/api/seller/wallet-status", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store", // Prevent caching
        });

        if (!response.ok) {
          throw new Error("Failed to fetch wallet status");
        }

        const data = await response.json();
        console.log("Wallet status response:", data); // Debug log
        setIsWalletConnected(data.isConnected);
      } catch (error) {
        console.error("Error checking wallet status:", error);
        // Default to false if there's an error
        setIsWalletConnected(false);
      }
    };

    // Initial check
    checkWalletStatus();

    // Set up polling to check every 5 seconds (optional, remove if not needed)
    const interval = setInterval(checkWalletStatus, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
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

        <main className="flex-1 overflow-y-auto pb-32 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-10">
            {/* A. Welcome & Store Status */}
            <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-2xl md:text-4xl mb-5 font-black uppercase tracking-tighter italic leading-none">
                  {loading ? (
                    <div className="h-10 w-64 bg-muted rounded animate-pulse"></div>
                  ) : (
                    getGreeting(userData?.name || "Seller")
                  )}
                </h1>

                <p className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                  {getDayGreeting()}
                </p>
              </div>

              <Link
                href="general-dashboard/seller-dashboard/add-product"
                className="bg-primary text-primary-foreground px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 w-full md:w-auto block text-center"
              >
                + Add New Product
              </Link>
            </section>

            {/* B. Key Metrics (Stat Cards) */}
<section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  {statsLoading ? (
    // Loading skeleton for stats
    Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="bg-card border border-border rounded-3xl p-4 lg:p-5 min-h-[120px] animate-pulse">
        <div className="flex justify-between items-start mb-4 lg:mb-3">
          <div className="p-2 bg-muted rounded-xl w-9 h-9"></div>
          <div className="h-4 w-12 bg-muted rounded-full"></div>
        </div>
        <div className="h-8 w-20 bg-muted rounded mb-2"></div>
        <div className="h-3 w-16 bg-muted rounded"></div>
      </div>
    ))
  ) : (
    stats.map((stat, i) => (
      <Link
        key={i}
        href={stat.href}
        className="group block focus:outline-none"
      >
        <div
          className="
            bg-card
            border border-border
            rounded-3xl
            p-4 lg:p-5
            min-h-[120px]
            transition-all
            hover:bg-muted/40
          "
        >
          {/* Top Row */}
          <div className="flex justify-between items-start mb-4 lg:mb-3">
            <div className="p-2 bg-muted rounded-xl text-primary">
              <stat.icon className="w-5 h-5" />
            </div>

            <span className="text-[9px] font-black uppercase tracking-tighter bg-foreground/5 px-2 py-0.5 rounded-full">
              {stat.trend}
            </span>
          </div>

          
          {/* Value */}
          <p className="text-2xl lg:text-3xl font-black italic tracking-tighter mb-1">
            {stat.value}
          </p>

          {/* Label */}
          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
            {stat.label}
          </p>

        </div>
      </Link>
    ))
  )}
</section>



            {/* D. Alerts & Actions (Sticky Notifications) */}
            <section className="space-y-4">
              {!isWalletConnected ? (
                <div className="bg-amber-500 text-black p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg border-2 border-black/10">
                  <div className="flex gap-4">
                    <AlertCircle className="w-6 h-6 shrink-0 mt-1 hidden md:block" />
                    <div>
                      <h3 className="font-black uppercase italic text-sm tracking-tight">
                        Add your crypto wallet for payouts
                      </h3>
                      <p className="text-[10px] font-bold uppercase opacity-80">
                        Connect a valid cryptocurrency wallet to receive payout
                        withdrawals.
                      </p>
                    </div>
                  </div>
                  <Link href="/general-dashboard/seller-dashboard/profile-settings">
                    <button className="w-full md:w-auto cursor-pointer bg-black text-white px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest">
                      Complete Now
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="bg-green-500 text-black p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg border-2 border-black/10">
                  <div className="flex gap-4">
                    <CheckCircle2 className="w-6 h-6 shrink-0 mt-1 hidden md:block" />
                    <div>
                      <h3 className="font-black uppercase italic text-sm tracking-tight">
                        Crypto Wallet Connected
                      </h3>
                      <p className="text-[10px] font-bold uppercase opacity-80">
                        Your wallet is ready to receive payouts.
                      </p>
                    </div>
                  </div>
                  <button
                    className="w-full md:w-auto cursor-pointer bg-black text-white px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest"
                    disabled
                  >
                    Connected
                  </button>
                </div>
              )}
            </section>

            {/* C. Recent Orders Table */}
            <div className="col-span-1">
              <div className="bg-card border border-border rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-border flex justify-between items-end">
                  <h2 className="text-sm font-black uppercase tracking-widest">
                    Recent Orders
                  </h2>
                  <Link
                    href="/general-dashboard/seller-dashboard/orders-management"
                    className="text-[10px] font-black uppercase text-primary hover:underline"
                  >
                    View All Orders
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-muted/30 border-b border-border">
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">
                          Image
                        </th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">
                          Order ID
                        </th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">
                          Buyer
                        </th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">
                          Country
                        </th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">
                          Product Code
                        </th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground">
                          Status
                        </th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {ordersLoading ? (
                        // Loading skeleton
                        Array.from({ length: 5 }).map((_, index) => (
                          <tr key={index} className="animate-pulse">
                            <td className="px-6 py-5">
                              <div className="w-10 h-10 bg-muted rounded-lg"></div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="h-4 w-20 bg-muted rounded"></div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="h-4 w-16 bg-muted rounded"></div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="h-4 w-12 bg-muted rounded"></div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="h-4 w-16 bg-muted rounded"></div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="h-4 w-12 bg-muted rounded"></div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="h-6 w-16 bg-muted rounded-full"></div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="h-8 w-8 bg-muted rounded-lg"></div>
                            </td>
                          </tr>
                        ))
                      ) : recentOrders.length === 0 && paginationInfo?.totalOrders === 0 ? (
                        <tr>
                          <td
                            colSpan={8}
                            className="px-6 py-12 text-center text-muted-foreground"
                          >
                            <div className="flex flex-col items-center gap-2">
                              <div className="relative mb-6 group">
                    <img
                      src="https://i.postimg.cc/LXSKYHG4/empty-box-removebg-preview.png"
                      alt="Empty Box"
                      className="w-40 h-40 object-contain cursor-pointer grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-out"
                    />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary/20 blur-sm rounded-full" />
                  </div>
                              <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">
                                No Orders found
                              </h3>

                              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest max-w-[250px] leading-relaxed">
                                Your recent orders will appear here
                              </p>

                              <Link 
                                                href="/general-dashboard/seller-dashboard/orders-management" 
                                                className="inline-block bg-foreground text-background cursor-pointer px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground hover:shadow-[0_10px_30px_rgba(var(--primary),0.3)] transition-all"
                                              >
                                                Check Orders
                                              </Link>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        recentOrders.map((order) => (
                          <tr
                            key={order.id}
                            className="hover:bg-muted/20 transition-colors group"
                          >
                            <td className="px-6 py-5">
                              <img
                                src={order.image}
                                alt="Product"
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            </td>
                            <td className="px-6 py-5 font-black text-sm uppercase tracking-tighter italic">
                              {order.id}
                            </td>
                            <td className="px-6 py-5 text-xs font-bold">
                              {order.buyer}
                            </td>
                            <td className="px-6 py-5 text-xs font-bold">
                              {order.country}
                            </td>
                            <td className="px-6 py-5 text-xs font-bold">
                              {order.productCode}
                            </td>
                            <td className="px-6 py-5 font-black italic">
                              ${order.total.toFixed(2)}
                            </td>
                            <td className="px-6 py-5">
                              <span
                                className={`text-[9px] font-black uppercase px-2 py-1 rounded-full border ${
                                  order.status === "Pending"
                                    ? "border-amber-500/20 text-amber-500 bg-amber-500/5"
                                    : order.status === "Shipped"
                                      ? "border-blue-500/20 text-blue-500 bg-blue-500/5"
                                      : "border-green-500/20 text-green-500 bg-green-500/5"
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <Link
                                href={`/general-dashboard/seller-dashboard/orders-management`}
                                className="p-2 inline-block bg-muted rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>

        <SellerNav />
      </div>
    </div>
  );
}
