"use client";

import React, { useState } from "react";
import BuyerHeader from "@/components/buyer-dashboard/BuyerHeader";
import BuyerSidebar from "@/components/buyer-dashboard/BuyerSidebar";
import BuyerNav from "@/components/buyer-dashboard/BuyerNav";

// You can later replace these with real data fetching (e.g. React Query, SWR, or Next.js fetch)
const mockStats = {
  cartItems: 3,
  activeOrders: 2,
  completedOrders: 7,
  totalSpent: 1249.99,
};

const mockRecentOrders = [
  { id: "ORD-9876", date: "Jan 15, 2026", amount: 349.00, status: "Shipped" },
  { id: "ORD-9875", date: "Jan 12, 2026", amount: 89.99, status: "Delivered" },
  { id: "ORD-9874", date: "Jan 8, 2026", amount: 199.50, status: "Pending" },
];

const mockActionsNeeded = [
  { title: "Confirm delivery", description: "Order #ORD-9872 arrived", cta: "Confirm Now" },
  { title: "Payment reminder", description: "Order #ORD-9868 - Payment pending", cta: "Pay Now" },
];

export default function BuyerOverviewPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <BuyerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <BuyerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {/* Welcome & Snapshot */}
          <section className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Good morning, <span className="text-muted-foreground">Alex</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Account active • Default delivery: 123 Lagos Street, Ikeja
            </p>
          </section>

          {/* Quick Stats Cards */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow transition-shadow cursor-pointer">
              <p className="text-sm text-muted-foreground">Cart</p>
              <p className="text-2xl font-bold mt-1">{mockStats.cartItems}</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow transition-shadow cursor-pointer">
              <p className="text-sm text-muted-foreground">Active Orders</p>
              <p className="text-2xl font-bold mt-1">{mockStats.activeOrders}</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow transition-shadow cursor-pointer">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold mt-1">{mockStats.completedOrders}</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow transition-shadow cursor-pointer">
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold mt-1">${mockStats.totalSpent.toLocaleString()}</p>
            </div>
          </section>

          {/* Orders That Need Action */}
          {mockActionsNeeded.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Action Required</h2>
              <div className="space-y-4">
                {mockActionsNeeded.map((action, i) => (
                  <div
                    key={i}
                    className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-5 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="font-semibold">{action.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                    </div>
                    <button className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                      {action.cta}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recent Orders */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recent Orders</h2>
              <a href="/buyer/orders" className="text-sm text-primary hover:underline">
                View all
              </a>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {mockRecentOrders.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No orders yet. Start shopping today!
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {mockRecentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-5 flex items-center justify-between gap-4 hover:bg-muted/40 transition-colors cursor-pointer"
                    >
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.amount.toFixed(2)}</p>
                        <span
                          className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full mt-1 ${
                            order.status === "Delivered"
                              ? "bg-green-500/20 text-green-700"
                              : order.status === "Shipped"
                              ? "bg-blue-500/20 text-blue-700"
                              : "bg-amber-500/20 text-amber-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Recommendations / Continue Shopping */}
<section className="mb-25 lg:mb-12">
            <h2 className="text-xl font-bold mb-4">Continue Shopping</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Placeholder product cards — replace with real data later */}
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    <span className="text-4xl opacity-30">?</span>
                  </div>
                  <div className="p-3">
                    <p className="font-medium truncate">Product Name {i + 1}</p>
                    <p className="text-sm text-muted-foreground mt-1">$49.99</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <BuyerNav />
      </div>
    </div>
  );
}