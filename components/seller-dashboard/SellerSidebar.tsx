"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  UserCheck,
  PlusCircle,
  Package,
  Wallet,
  ArrowDownToLine,
  Truck,
  AlertOctagon,
  Bell,
  Inbox,
  Server,
  Trophy,
  MapPin,
  BarChart3,
  History,
  LogOut,
  X,
  LayoutDashboard,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function SellerSidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { isAdmin } = useAuth();

  const basePath = "/general-dashboard/seller-dashboard";

  // Updated navigation items for Seller Dashboard
  const sidebarItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: `${basePath}/dashboard` },
    { name: "Add Product", icon: PlusCircle, href: `${basePath}/add-product` },
    { name: "My Products", icon: Package, href: `${basePath}/my-products` },
    { name: "Orders Control", icon: Truck, href: `${basePath}/orders-management` },
    { name: "Tracking Info", icon: MapPin, href: `${basePath}/tracking-info` },
    { name: "Sales Analytics", icon: BarChart3, href: `${basePath}/analytics` },
    { name: "Request Payout", icon: Wallet, href: `${basePath}/request-payout` },
    { name: "Seller Leaderboard", icon: Trophy, href: `${basePath}/leaderboard` },
    { name: "Profile & Settings", icon: UserCheck, href: `${basePath}/profile-settings` },
    ...(isAdmin ? [{ name: "# Admin Auth Panel", icon: Server, href: `/general-dashboard/admin-dashboard/dashboard` }] : []),
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-65 transform bg-background border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-2xl lg:shadow-none`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between h-15 px-6 border-b border-border">
          <div className="flex flex-col">
            <h1 className="text-xl font-black uppercase tracking-tighter italic text-foreground">
              Shop<span className="text-muted-foreground italic">dot</span>fun
            </h1>
            <p className="text-[8px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
              Growth & Earnings
            </p>
          </div>
          <button className="lg:hidden p-2" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex flex-col justify-between h-[calc(100vh-4rem)]">
          <nav className="px-4 py-6 space-y-1 overflow-y-auto">
            {sidebarItems.map(({ name, icon: Icon, href }) => {
              const active = isActive(href);
              return (
                <Link
                  key={name}
                  href={href}
                  className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                    active
                      ? "bg-foreground text-background shadow-lg shadow-black/10"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={`w-5 h-5 mr-3 transition-transform ${active ? "scale-110" : "group-hover:scale-110"}`} />
                  <span className="text-[12px] font-black uppercase tracking-widest">{name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Section */}
          <div className="p-4 border-t border-border">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center cursor-pointer w-full px-4 py-3 text-red-500 hover:bg-red-500/10 transition-all rounded-xl group"
            >
              <LogOut className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-black uppercase tracking-widest">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-background border border-border rounded-[2rem] shadow-2xl w-full max-w-sm p-8 text-center">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <LogOut className="w-8 h-8 text-foreground" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tighter text-foreground mb-2">Logout?</h2>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 px-6 py-3 rounded-xl bg-secondary cursor-pointer text-foreground font-bold text-xs uppercase tracking-widest">Stay</button>
              <button 
                onClick={async () => {
                  try {
                    await signOut({ redirect: false });
                    router.push("/auth/login");
                    toast.success("Successfully signed out");
                  } catch (error) {
                    console.error('Error signing out:', error);
                    toast.error("Failed to sign out. Please try again.");
                  } finally {
                    setShowLogoutConfirm(false);
                  }
                }} 
                className="flex-1 px-6 py-3 rounded-xl bg-foreground cursor-pointer text-background font-bold text-xs uppercase tracking-widest hover:bg-foreground/90 transition-colors"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}