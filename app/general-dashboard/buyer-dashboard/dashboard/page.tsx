"use client";

import React, { useState } from "react";
import BuyerHeader from "@/components/buyer-dashboard/BuyerHeader";
import BuyerSidebar from "@/components/buyer-dashboard/BuyerSidebar";
import BuyerNav from "@/components/buyer-dashboard/BuyerNav";

export default function BuyerDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <BuyerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <BuyerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 flex items-center justify-center">
          <div className="text-center animate-in fade-in zoom-in duration-700">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none mb-4">
              Welcome, <span className="text-muted-foreground">Buyer</span>
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground font-bold uppercase tracking-[0.4em]">
              Start your next discovery today
            </p>
            <div className="pt-8">
                <div className="h-1 w-20 bg-foreground mx-auto rounded-full" />
              </div>
          </div>
        </main>

        <BuyerNav />
      </div>
    </div>
  );
}