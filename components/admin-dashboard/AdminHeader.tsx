"use client";

import React, { useEffect, useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react"; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes"; // Import useTheme

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface AdminData {
  name: string;
  email: string;
  role?: string;
}

export default function AdminHeader({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch('/api/admin/profile');
        if (response.ok) {
          const data = await response.json();
          setAdmin({
            name: data.name,
            email: data.email,
            role: data.role
          });
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <header className="h-15 border-b border-border flex items-center justify-between gap-4 px-4 sm:px-10 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      
      {/* LEFT: Mobile Menu & Logo Section */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors cursor-pointer"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
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
        
        {/* THEME TOGGLE BUTTON */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2.5 rounded-xl border border-border hover:bg-secondary transition-all cursor-pointer group"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
          ) : (
            <Moon className="h-5 w-5 text-slate-700 group-hover:-rotate-12 transition-transform duration-300" />
          )}
        </button>

        <div className="flex items-center gap-3 sm:pl-6 sm:border-l border-border">
          <div className="text-right hidden lg:block">
            <p className="text-xs font-black uppercase tracking-tight leading-none text-foreground">
              {isLoading ? 'Loading...' : admin?.name || 'Admin'}
            </p>
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter mt-1">
              {isLoading ? 'Loading...' : admin?.email || 'admin@example.com'}
            </p>
          </div>
          
          <Avatar className="h-9 w-9 md:h-11 md:w-11 border-2 border-foreground/20 hover:border-foreground transition-all rounded-xl p-0.5 cursor-pointer">
            <AvatarImage src="https://github.com/shadcn.png" className="rounded-lg" />
            <AvatarFallback className="rounded-lg bg-foreground text-background font-bold">
              {isLoading ? '...' : admin?.name?.charAt(0) || 'A'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}