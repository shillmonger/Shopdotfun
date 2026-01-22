"use client";

import React from "react";
import { Menu, X, Bell } from "lucide-react"; // Added X
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

interface HeaderProps {
  sidebarOpen: boolean; // Added this
  setSidebarOpen: (open: boolean) => void;
}

export default function SellerHeader({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const { data: session } = useSession();
  
  return (
    <header className="h-15 border-b border-border flex items-center justify-between gap-4 px-4 sm:px-10 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      
      {/* LEFT: Mobile Menu & Logo Section */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors cursor-pointer"
          onClick={() => setSidebarOpen(!sidebarOpen)} // Toggles state
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
        <div className="flex items-center gap-3 sm:pl-6 sm:border-l border-border">
          <div className="text-right hidden lg:block">
            <p className="text-xs font-black uppercase tracking-tight leading-none text-foreground">
              {session?.user?.name || 'Seller'}
            </p>
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter mt-1">
              {session?.user?.email || 'Seller mail'}
            </p>
          </div>
          
          <Avatar className="h-9 w-9 md:h-11 md:w-11 border-2 border-foreground/20 hover:border-foreground transition-all rounded-xl p-0.5 cursor-pointer">
            <AvatarImage src="https://github.com/shadcn.png" className="rounded-lg" />
            <AvatarFallback className="rounded-lg bg-foreground text-background font-bold">
              {session?.user?.name?.charAt(0) || 'S'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}