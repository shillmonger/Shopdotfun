"use client";

import React from "react";
import { Menu, X, Bell, ShoppingCart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function BuyerHeader({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const { data: session } = useSession();
  
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
        <button className="p-2 hover:bg-secondary rounded-full relative cursor-pointer">
            <ShoppingCart className="h-5 w-5" />
            {/* <span className="absolute top-1 right-1 h-2 w-2 bg-foreground rounded-full" /> */}
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <Avatar className="h-9 w-9 border-2 border-foreground/20 rounded-xl p-0.5">
            <AvatarImage src="https://github.com/shadcn.png" className="rounded-lg" />
            <AvatarFallback className="rounded-lg font-bold">B</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}