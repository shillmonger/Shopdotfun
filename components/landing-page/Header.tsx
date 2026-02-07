"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  ShoppingCart,
  HelpCircle,
  Mail,
  Users,
  ShoppingBag,
  FileText,
  Store,
  Home,
  Tag,
  Headset,
  Building2,
  ChevronDown,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useCrypto } from "@/contexts/CryptoContext";

/**
 * FIXED: CartIcon is now defined outside the main component.
 * This prevents the 'react-hooks/static-components' build error.
 */
const CartIcon = ({ 
  size = 22, 
  cartItemsCount 
}: { 
  size?: number; 
  cartItemsCount: number 
}) => (
  <div className="relative">
    <ShoppingCart size={size} />
    {cartItemsCount > 0 && (
      <span
        className="absolute -top-1.5 -right-1.5
          bg-primary text-white dark:text-black
          text-[10px] font-bold
          rounded-full
          h-4 min-w-[16px] px-1
          flex items-center justify-center
          leading-none border-2 border-background"
      >
        {cartItemsCount > 99 ? "99+" : cartItemsCount}
      </span>
    )}
  </div>
);

export function CryptoConverterDropdown({ className }: { className?: string }) {
  const { selectedCoin, setSelectedCoin, coins } = useCrypto();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`
            flex items-center gap-2 px-3 py-2
            rounded-xl border bg-background
            hover:bg-accent transition cursor-pointer
            ${className}
          `}
        >
          <img
            src={selectedCoin.icon}
            alt={selectedCoin.label}
            className="w-5 h-5 md:w-6 md:h-6 object-contain"
          />
          <span className="text-sm font-medium">
            {selectedCoin.symbol}
          </span>
          <ChevronDown size={14} className="opacity-60" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44 z-[100]">
        {coins.map((coin) => (
          <DropdownMenuItem
            key={coin.value}
            onClick={() => setSelectedCoin(coin)}
            className="flex items-center gap-4 cursor-pointer"
          >
            <img
              src={coin.icon}
              alt={coin.label}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span>{coin.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const pathname = usePathname();

  const closeMobileMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    const loadCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const totalItems = cart.reduce(
          (total: number, item: any) => total + item.quantity,
          0,
        );
        setCartItemsCount(totalItems);
      } catch (error) {
        console.error("Error loading cart count:", error);
        setCartItemsCount(0);
      }
    };

    loadCartCount();
    const handleStorageChange = () => loadCartCount();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleStorageChange);
    };
  }, []);

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
            <span className="text-[18px] md:text-2xl font-black italic tracking-tighter text-foreground bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
              SHOPDOTFUN
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center gap-1 bg-black/[0.02] dark:bg-white/[0.02] border border-border/50 px-2 py-1.5 rounded-full">
            <Link href="/" className={linkStyles("/")}>Home</Link>
            <Link href="/landing-page/top-stores" className={linkStyles("/landing-page/top-stores", false)}>Top Stores</Link>
            <Link href="/landing-page/blog" className={linkStyles("/landing-page/blog", false)}>Our Blog</Link>
            <Link href="/landing-page/know-us" className={linkStyles("/landing-page/know-us", false)}>Know Us</Link>
            <Link href="/landing-page/contact-us" className={linkStyles("/landing-page/contact-us", false)}>Contact Us</Link>
          </nav>

          {/* RIGHT SECTION: CART, CONVERTER, AUTH */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Show on both Mobile and Desktop */}
            <CryptoConverterDropdown className="hidden sm:flex" /> 
            
            <Link
              href="/landing-page/cart"
              className="p-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <CartIcon cartItemsCount={cartItemsCount} />
            </Link>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-3">
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
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <span className="font-black italic tracking-widest text-sm">NAVIGATION</span>
            <button onClick={closeMobileMenu} className="p-2 hover:bg-muted rounded-full">
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            <Link href="/" onClick={closeMobileMenu} className={linkStyles("/")}>
              <Home size={18} /> Home
            </Link>
            <Link href="/landing-page/cart" onClick={closeMobileMenu} className={linkStyles("/landing-page/cart")}>
              <CartIcon size={18} cartItemsCount={cartItemsCount} /> My Cart
            </Link>
            <Link href="/landing-page/blog" onClick={closeMobileMenu} className={linkStyles("/landing-page/blog")}>
              <FileText size={18} /> Our Blog
            </Link>
            <Link href="/landing-page/top-stores" onClick={closeMobileMenu} className={linkStyles("/landing-page/top-stores", false)}>
              <ShoppingBag size={18} /> Top Stores
            </Link>
            <Link href="/landing-page/know-us" onClick={closeMobileMenu} className={linkStyles("/landing-page/know-us", false)}>
              <Users size={18} /> About Us
            </Link>
            <Link href="/landing-page/help-center" onClick={closeMobileMenu} className={linkStyles("/landing-page/help-center")}>
              <Headset size={18} /> Help Center
            </Link>
          </nav>

          {/* Crypto Converter in Sidebar for Mobile */}
          <div className="mt-10 px-1">
            <p className="text-[10px] font-bold text-muted-foreground mb-2 tracking-widest uppercase">Currency</p>
            <CryptoConverterDropdown className="w-full justify-between" />
          </div>

          <div className="mt-auto flex flex-col gap-3 border-t border-border pt-6">
            <Button variant="outline" asChild className="py-6 rounded-xl text-lg font-bold">
              <Link href="/auth/login" onClick={closeMobileMenu}>Sign In</Link>
            </Button>
            <Button asChild className="py-6 rounded-xl text-lg font-bold">
              <Link href="/auth/register-buyer" onClick={closeMobileMenu}>Create Account</Link>
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-2">
              Want to sell?{" "}
              <Link href="/auth/register-seller" className="text-primary font-bold">
                Register as Vendor
              </Link>
            </p>
          </div>
        </div>
      </aside>
    </header>
  );
}