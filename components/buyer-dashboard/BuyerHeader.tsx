"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Bell, ShoppingCart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface BuyerData {
  name: string;
  email: string;
}

export default function BuyerHeader({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const [buyer, setBuyer] = useState<BuyerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBuyerData = async () => {
      try {
        const response = await fetch('/api/buyer/profile');
        if (response.ok) {
          const data = await response.json();
          setBuyer({
            name: data.name,
            email: data.email
          });
        }
      } catch (error) {
        console.error('Error fetching buyer data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuyerData();
  }, []);

  return (
    <header className="h-15 lg:h-15 border-b border-border flex items-center justify-between gap-4 px-4 sm:px-10 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <X className="h-6 w-6 animate-in fade-in zoom-in duration-300" />
          ) : (
            <Menu className="h-6 w-6 animate-in fade-in zoom-in duration-300" />
          )}
        </button>

        <div className="space-y-0.5">
          <p className="text-[8px] md:text-xs text-muted-foreground font-medium uppercase tracking-widest hidden xs:block">
            Member Experience
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/general-dashboard/buyer-dashboard/cart">
          <button className="p-2 hover:bg-secondary rounded-full relative cursor-pointer">
            <ShoppingCart className="h-5 w-5" />
          </button>
        </Link>

        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right hidden lg:block">
            <p className="text-xs font-black uppercase tracking-tight leading-none text-foreground">
              {isLoading ? 'Loading...' : buyer?.name || 'Buyer'}
            </p>
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter mt-1">
              {isLoading ? 'Loading...' : buyer?.email || 'Buyer email'}
            </p>
          </div>
          <Avatar className="h-9 w-9 border-2 border-foreground/20 rounded-xl p-0.5">
            <AvatarImage src="https://github.com/shadcn.png" className="rounded-lg" />
            <AvatarFallback className="rounded-lg font-bold">
              {isLoading ? '...' : buyer?.name?.charAt(0) || 'B'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}