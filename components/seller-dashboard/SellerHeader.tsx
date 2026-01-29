"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  sidebarOpen: boolean; 
  setSidebarOpen: (open: boolean) => void;
}

interface SellerData {
  name: string;
  email: string;
  businessName?: string;
}

export default function SellerHeader({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const [seller, setSeller] = useState<SellerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const response = await fetch('/api/seller/profile');
        if (response.ok) {
          const data = await response.json();
          setSeller({
            name: data.name,
            email: data.email,
            businessName: data.businessName
          });
        }
      } catch (error) {
        console.error('Error fetching seller data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSellerData();
  }, []);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const response = await fetch('/api/seller/notifications');
        if (response.ok) {
          const data = await response.json();
          setNotificationCount(data.data?.length || 0);
        }
      } catch (error) {
        console.error('Error fetching notification count:', error);
      }
    };

    fetchNotificationCount();
  }, []);

  return (
    <header className="h-15 border-b border-border flex items-center justify-between gap-4 px-4 sm:px-10 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      
      {/* LEFT: Mobile Menu & Logo Section */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors cursor-pointer"
          onClick={() => setSidebarOpen(!sidebarOpen)} 
        >
          {/* Toggle between Menu and X icon */}
          {sidebarOpen ? (
            <X className="h-6 w-6 text-foreground animate-in fade-in zoom-in duration-300" />
          ) : (
            <Menu className="h-6 w-6 text-foreground animate-in fade-in zoom-in duration-300" />
          )}
        </button>

        <div className="space-y-0.5">
          <p className="text-[8px] md:text-xs text-muted-foreground font-medium uppercase tracking-widest hidden xs:block">
            Marketplace Dashboard
          </p>
        </div>
      </div>

      {/* RIGHT: Profile & Actions */}
      <div className="flex items-center gap-2 sm:gap-6 flex-shrink-0">
        {/* NEW SEPARATOR ADDED HERE */}
        <div className="sm:pl-6 border-border flex items-center h-full">
          <Link href="/general-dashboard/seller-dashboard/notifications">
            <button className="p-2 hover:bg-secondary rounded-full relative cursor-pointer">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[8px] font-black rounded-full h-4 w-4 flex items-center justify-center border-2 border-background">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </button>
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:pl-6 sm:border-l border-border">
          <div className="text-right hidden lg:block">
            <p className="text-xs font-black uppercase tracking-tight leading-none text-foreground">
              {isLoading ? 'Loading...' : seller?.name || 'Seller'}
            </p>
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter mt-1">
              {isLoading ? 'Loading...' : seller?.email || 'Seller email'}
            </p>
          </div>
          
          <Avatar className="h-9 w-9 md:h-11 md:w-11 border-2 border-foreground/20 hover:border-foreground transition-all rounded-xl p-0.5 cursor-pointer">
            <AvatarImage src="https://github.com/shadcn.png" className="rounded-lg" />
            <AvatarFallback className="rounded-lg bg-foreground text-background font-bold">
              {isLoading ? '...' : seller?.name?.charAt(0) || 'S'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}