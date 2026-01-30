"use client";

import { useState } from "react";
import BuyerHeader from "@/components/buyer-dashboard/BuyerHeader";
import BuyerSidebar from "@/components/buyer-dashboard/BuyerSidebar";
import BuyerNav from "@/components/buyer-dashboard/BuyerNav";

export default function NotificationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      <BuyerSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1">
        <BuyerHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <BuyerNav />

        <main className="p-6 space-y-8">
          <h1 className="text-2xl font-bold">Notifications</h1>

          {/* Payment Status Notifications */}
          <section className="bg-card rounded-lg p-4 shadow">
            <h2 className="text-lg font-semibold mb-2">Payment Status</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✅ Payment received for Order #10234</li>
              <li>⏳ Payment pending for Order #10241</li>
              <li>❌ Payment failed for Order #10255</li>
            </ul>
          </section>

          {/* Order Notifications */}
          <section className="bg-card rounded-lg p-4 shadow">
            <h2 className="text-lg font-semibold mb-2">Order Updates</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>📦 Order #10234 has been shipped</li>
              <li>🆕 New order received: #10260</li>
              <li>🚚 Order #10210 is out for delivery</li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}
