"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/landing-page/Header";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import Footer from "@/components/landing-page/Footer";
import Features from "@/components/landing-page/Features";
import FeaturedCollection from "@/components/landing-page/FeaturedCollection";
import { Button } from "@/components/ui/button";
import { HotTrendingProducts } from "@/components/landing-page/HotTrendingProducts";
import { PopularCategories } from "@/components/landing-page/PopularCategories";
import { HowItWorks } from "@/components/landing-page/HowItWorks";

export default function HomePage() {
  const [activeIdx, setActiveIdx] = useState(5);
  // Handle scroll to section when page loads with a hash
  useEffect(() => {
    // Only run on client-side
    if (typeof window === "undefined") return;

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          // Small timeout to ensure the page has rendered
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      }
    };

    // Initial check
    const timer = setTimeout(() => {
      handleHashChange();
    }, 0);

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative w-full pt-32 md:pt-40 px-4 md:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
          {/* Left Content */}
          <div className="flex flex-col gap-6 items-center text-center sm:items-start sm:text-left">
            <span className="text-primary font-semibold tracking-widest uppercase text-sm">
              Secure Multi-Vendor Marketplace
            </span>

            <h1 className="text-5xl sm:text-6xl font-black tracking-tighter leading-tight bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
              Shop with Confidence, <br /> Sell with Ease.
            </h1>

            <p className="text-muted-foreground text-lg sm:text-xl max-w-xl leading-relaxed">
              Shopdotfun is your trusted middleman. Discover verified products
              from top-rated sellers, protected by our secure escrow payment
              system and fair dispute resolution.
            </p>

            {/* BUTTONS UPDATED BELOW */}
            <div className="mt-6 flex px-5 flex-row gap-3 sm:gap-4 justify-center sm:justify-start">
              <Button
                asChild
                size="lg"
                className="
            w-1/2 sm:w-auto
            font-bold
            h-auto
            py-4 sm:py-4
            px-4 sm:px-10
            text-[16px] sm:text-[17px]
            rounded-2xl
            shadow-lg
            active:scale-95
          "
              >
                <Link href="/auth/login" className="flex items-center gap-2">
                  Start Shopping
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="
            w-1/2 sm:w-auto
            font-bold
            h-auto
            py-4 sm:py-4
            px-4 sm:px-10
            text-[16px] sm:text-[17px]
            rounded-2xl
            border-2
            active:scale-95
          "
              >
                <Link href="/auth/register-seller">Become a Seller</Link>
              </Button>
            </div>
          </div>

          {/* Right Content – Marketplace Preview */}
          <div className="relative flex justify-center items-center py-12 lg:py-20 overflow-visible w-full px-4">
            {/* Glow behind the cards */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-primary/20 blur-[80px] md:blur-[150px] rounded-full -z-10" />

            {/* The Container - using flex-nowrap to prevent folding */}
            <div className="relative w-full max-w-[800px] flex items-center justify-center">
              {/* Card 1 - Left */}
              <div
                className="
            w-[130px] h-[200px] -mr-16 sm:mr-0
            md:w-[220px] md:h-[300px] 
            relative rounded-2xl md:rounded-3xl overflow-hidden 
            bg-background/50 backdrop-blur-md border border-white/10 shadow-lg 
            group cursor-pointer 
            -rotate-[10deg] md:-rotate-[8deg] 
            translate-y-4 md:translate-y-6 
            transition-all duration-500 z-10
            hover:rotate-0 hover:translate-y-0 hover:z-40 hover:scale-110
          "
              >
                <img
                  src="https://i.postimg.cc/ZR3bz4Cw/Vintage-Men.jpg"
                  alt="Featured Men's T-Shirt"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500"
                  />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3 md:p-5">
                  <p className="text-white text-[8px] md:text-sm font-bold uppercase tracking-wide">
                    Style
                  </p>
                </div>
              </div>

              {/* Card 2 - Main Tech Hero */}
              <div
                className="
            w-[220px] h-[320px] 
            sm:w-[280px] sm:h-[380px] 
            md:w-[320px] md:h-[420px] 
            relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden 
            bg-zinc-900 border-2 border-primary/30 shadow-2xl z-30 
            scale-110 ring-4 md:ring-8 ring-primary/5 
            group cursor-pointer transition-all duration-500 hover:scale-[1.15]
            "
            >
                <img
            src="https://i.postimg.cc/vZW7SsZv/Vintage-Denim-Jacket.jpg"
                  alt="Featured Jacket"
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500"
                />
                <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-primary px-3 py-1 md:px-4 md:py-1.5 rounded-full shadow-lg">
                  <p className="text-[8px] md:text-[11px] font-black uppercase text-primary-foreground tracking-tighter">
                    Verified
                  </p>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/40 to-transparent flex items-end p-5 md:p-8">
                  <p className="text-white text-base md:text-lg font-black uppercase italic">
                    New Arrivals
                  </p>
                </div>
              </div>

              {/* Card 3 - Right */}
              <div
                className="
            w-[130px] h-[200px] -ml-16 sm:ml-0
            md:w-[220px] md:h-[300px] 
            relative rounded-2xl md:rounded-3xl overflow-hidden 
            bg-background/50 backdrop-blur-md border border-white/10 shadow-lg 
            group cursor-pointer 
            rotate-[10deg] md:rotate-[8deg] 
            translate-y-4 md:translate-y-6 
            transition-all duration-500 z-10
            hover:rotate-0 hover:translate-y-0 hover:z-40 hover:scale-110
          "
              >
                <img
                  src="https://i.postimg.cc/zBfZDNtt/Polo-T-Shirt-Pack.jpg"
                  alt="Featured T-Shirt"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3 md:p-5">
                  <p className="text-white text-[8px] md:text-sm font-bold uppercase tracking-wide">
                    Tech
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Features */}
<Features />


      {/* Hot Trending Products */}
      <HotTrendingProducts />
      
      {/* Featured Collection */}
      <FeaturedCollection />

      {/* Popular Categories */}
      <PopularCategories />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Nav */}
      <ThemeAndScroll />

      {/* Footer scection */}
      <Footer />
    </main>
  );
}
