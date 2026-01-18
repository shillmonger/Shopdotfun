"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart, HelpCircle, Store, Home, Tag, Headset, Building2
 } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Unified helper for both Desktop and Mobile highlights
  const linkStyles = (href: string, exact: boolean = true) => {
    const isActive = exact ? pathname === href : pathname.startsWith(href);
    return `px-4 py-3 md:py-2 text-[15px] md:text-[14px] font-bold tracking-wide transition-all rounded-xl md:rounded-full flex items-center gap-3 md:gap-0 hover:text-foreground ${
      isActive 
        ? "text-foreground bg-black/[0.08] dark:bg-white/[0.1] shadow-sm" 
        : "text-muted-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"
    }`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-0">
        <div className="flex items-center justify-between h-16 md:h-17">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[20px] md:text-2xl font-black italic tracking-tighter text-foreground bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
              SHOPDOTFUN
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center gap-1 bg-black/[0.02] dark:bg-white/[0.02] border border-border/50 px-2 py-1.5 rounded-full">
            <Link href="/" className={linkStyles("/")}>
              Home
            </Link>
            <Link href="/landing-page/top-stores" className={linkStyles("/landing-page/top-stores", false)}>
              Top Stores
            </Link>
            <Link href="/landing-page/know-us" className={linkStyles("/landing-page/know-us", false)}>
              Know Us
            </Link>
            <Link href="/landing-page/help-center" className={linkStyles("/landing-page/help-center", false)}>
              Help & Support
            </Link>
          </nav>

          {/* AUTH BUTTONS & CART */}
          <div className="hidden md:flex items-center gap-3 ml-4">
            <Link href="/cart" className="p-2 mr-2 text-muted-foreground hover:text-primary transition-colors">
              <ShoppingCart size={22} />
            </Link>
            <Button asChild variant="secondary" className="px-6 py-6 text-[15px] font-semibold rounded-xl cursor-pointer">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild className="px-6 py-6 text-[15px] font-semibold rounded-xl cursor-pointer">
              <Link href="/auth/register-seller">Sell on Fun</Link>
            </Button>
          </div>

          {/* MOBILE TOGGLE */}
          <button 
            onClick={() => setMobileMenuOpen(true)} 
            className="md:hidden p-2 text-foreground"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* MOBILE MENU BACKDROP */}
      <div
        onClick={closeMobileMenu}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* MOBILE SIDEBAR */}
      <aside
        className={`fixed right-0 top-0 h-full w-[300px] bg-background border-l border-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 h-full flex flex-col z[200]">
          <div className="flex justify-between items-center mb-10">
            <span className="font-black italic tracking-widest text-sm">NAVIGATION</span>
            <button onClick={closeMobileMenu} className="p-2 hover:bg-muted rounded-full">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Updated Mobile Nav with Active/Hover Colors matching Desktop */}
          <nav className="flex flex-col gap-2">
            <Link href="/" onClick={closeMobileMenu} className={linkStyles("/")}>
              <Home size={18} /> Home
            </Link>
            <Link href="/cart" onClick={closeMobileMenu} className={linkStyles("/cart")}>
              <ShoppingCart size={18} /> My Cart
            </Link>
            <Link href="/landing-page/top-stores" onClick={closeMobileMenu} className={linkStyles("/landing-page/top-stores", false)}>
              <Store size={18} /> Top Stores
            </Link>
            <Link href="/landing-page/know-us" onClick={closeMobileMenu} className={linkStyles("/landing-page/know-us", false)}>
              <Building2 size={18} /> Know Us
            </Link>
            <Link href="/landing-page/help-center" onClick={closeMobileMenu} className={linkStyles("/landing-page/help-center")}>
              <Headset size={18} /> Help Center
            </Link>
          </nav>

          <div className="mt-auto flex flex-col gap-3 border-t border-border pt-6">
            <Button variant="outline" asChild className="py-6 rounded-xl text-lg font-bold">
              <Link href="/auth/login" onClick={closeMobileMenu}>Sign In</Link>
            </Button>
            <Button asChild className="py-6 rounded-xl text-lg font-bold">
              <Link href="/auth/register-buyer" onClick={closeMobileMenu}>Create Account</Link>
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-2">
              Want to sell? <Link href="/auth/register-seller" className="text-primary font-bold">Register as Vendor</Link>
            </p>
          </div>
        </div>
      </aside>
    </header>
  );
}