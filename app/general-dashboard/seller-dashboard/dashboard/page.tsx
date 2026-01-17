"use client";

import React, { useState } from "react";
import { Toaster } from "sonner";

// Import your custom components
import SellerHeader from "@/components/seller-dashboard/SellerHeader";
import SellerSidebar from "@/components/seller-dashboard/SellerSidebar";
import SellerNav from "@/components/seller-dashboard/SellerNav";

export default function SellerDashboardPage() {
  // State to sync the sidebar toggle between Header and Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background font-inter">
      <Toaster position="top-center" richColors />
      
      {/* Sidebar - Pass state and setter */}
      <SellerSidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        {/* Header - Pass state and setter for the Hamburger-to-X logic */}
        <SellerHeader 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24">
          <div className="max-w-7xl mx-auto h-full flex flex-col items-center justify-center text-center">
            
            {/* Simple Welcome Section */}
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none text-foreground">
                Welcome, <span className="text-muted-foreground">Seller</span>
              </h1>
              <p className="text-sm md:text-base text-muted-foreground font-medium uppercase tracking-[0.3em]">
                Your marketplace overview is ready
              </p>
              
              <div className="pt-8">
                <div className="h-1 w-20 bg-foreground mx-auto rounded-full" />
              </div>
            </div>

          </div>
        </main>

        {/* Bottom Nav for Mobile */}
        <SellerNav />
      </div>
    </div>
  );
}