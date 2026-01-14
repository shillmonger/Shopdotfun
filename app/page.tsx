"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/landing-page/Header";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import Footer from "@/components/landing-page/Footer";
import FeaturedCollection from "@/components/landing-page/FeaturedCollection";
import { Button } from "@/components/ui/button";

import {
  ShieldCheck,
  Play,
  Image as ImageIcon,
  FileText,
  ShoppingBag,
  ArrowRight,
  ExternalLink,
  Lock,
  Shield,
  CheckCircle,
  FolderOpen,
  PlayCircle,
  BookOpen,
  Search,
  Eye,
  Star,
  Download,
  ShoppingCart,
  ChevronRight,
  BellRing,
  CreditCard,
  Truck,
  Coins,
  Smile,
} from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FeatureCard } from "@/components/landing-page/FeatureCard";
import { HotTrendingProducts } from "@/components/landing-page/HotTrendingProducts";
import { PopularCategories } from "@/components/landing-page/PopularCategories";
import { CategoryDeals } from "@/components/landing-page/CategoryDeals";

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

            <h1 className="text-5xl sm:text-6xl font-black tracking-tighter leading-tight">
              Shop with Confidence, <br /> Sell with Ease.
            </h1>

            <p className="text-muted-foreground text-lg sm:text-xl max-w-xl leading-relaxed">
              Shopdotfun is your trusted middleman. Discover verified products
              from top-rated sellers, protected by our secure escrow payment
              system and fair dispute resolution.
            </p>

            <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-center sm:justify-start w-full">
              <Button
                asChild
                size="lg"
                className="font-bold py-7 px-8 rounded-xl text-[17px] shadow-lg active:scale-95"
              >
                <Link href="/products" className="flex items-center gap-2">
                  Start Shopping
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="font-bold py-7 px-8 rounded-xl text-[17px] border-2 active:scale-95"
              >
                <Link href="/auth/seller/register">Become a Seller</Link>
              </Button>
            </div>
          </div>

          {/* Right Content – Marketplace Preview */}
          <div className="relative flex justify-center items-center py-10">
            {/* Glow behind the cards */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/20 blur-[120px] rounded-full -z-10" />

            <div className="relative w-full max-w-[800px] hidden md:flex gap-6 items-center justify-center">
              {/* Card 1 - Fashion/Categories Preview */}
              <div className="w-[220px] h-[300px] rounded-3xl overflow-hidden bg-background/50 backdrop-blur-md border border-white/10 shadow-lg group cursor-pointer -rotate-[8deg] translate-y-6 transition-all duration-500 hover:rotate-0 hover:translate-y-0 hover:z-30 hover:scale-105">
                <img
                  src="https://i.postimg.cc/vZW7SsZv/Vintage-Denim-Jacket.jpg"
                  alt="Fashion Category"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-5">
                  <p className="text-white text-sm font-bold uppercase tracking-wide">
                    Trending Style
                  </p>
                </div>
              </div>

              {/* Card 2 - Main Tech Hero */}
              <div className="w-[320px] h-[420px] rounded-[2.5rem] overflow-hidden bg-zinc-900 border-2 border-primary/30 shadow-2xl z-20 scale-105 ring-8 ring-primary/5 group cursor-pointer transition-all duration-500 hover:scale-110">
                <img
                  src="https://i.postimg.cc/Hnk3qsLb/Homens-Colar-de-pingente-Strass-Dolar.jpg"
                  alt="Featured Gadgets"
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500"
                />
                {/* Status Badge */}
                <div className="absolute top-6 right-6 bg-primary px-4 py-1.5 rounded-full shadow-lg">
                  <p className="text-[11px] font-black uppercase text-primary-foreground tracking-tighter">
                    Verified Store
                  </p>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/40 to-transparent flex items-end p-8">
                  <p className="text-white text-lg font-black uppercase italic">
                    New Arrivals
                  </p>
                </div>
              </div>

              {/* Card 3 - Lifestyle Preview */}
              <div className="w-[220px] h-[300px] rounded-3xl overflow-hidden bg-background/50 backdrop-blur-md border border-white/10 shadow-lg group cursor-pointer rotate-[8deg] translate-y-6 transition-all duration-500 hover:rotate-0 hover:translate-y-0 hover:z-30 hover:scale-105">
                <img
                  src="https://i.postimg.cc/ydczDjhF/Ninja-Dragons.jpg"
                  alt="Electronics"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-5">
                  <p className="text-white text-sm font-bold uppercase tracking-wide">
                    Tech Gadgets
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Hot Trending Products */}
      <HotTrendingProducts />



      {/* Popular Categories */}
      <PopularCategories />


{/* Featured Collection - 7 Card 3D Stack */}
      <FeaturedCollection />

      {/* Category Deals Section */}
      <CategoryDeals />


      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="max-w-[1400px] mx-auto px-4 lg:px-0 py-20 w-full"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-6">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-base md:text-lg">
            Shopdotfun acts as a trusted middleman to ensure every transaction
            is secure for both buyers and sellers. Here is our simple 6-step
            process.
          </p>
        </div>

        {/* Desktop / Tablet Grid (3 columns, 2 rows) */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 cursor-pointer">
          <FeatureCard
            title="1. Add to Cart"
            description="Browse our verified marketplace and add your favorite products from top-rated vendors to your shopping cart."
            icon={<ShoppingCart className="w-6 h-6 text-primary" />}
          />

          <FeatureCard
            title="2. Make Payment"
            description="Pay securely via our automated gateway. The platform holds your funds in escrow to protect your purchase."
            icon={<CreditCard className="w-6 h-6 text-primary" />}
          />

          <FeatureCard
            title="3. Product Shipment"
            description="The seller is notified immediately to process your order and provide tracking information for your package."
            icon={<Truck className="w-6 h-6 text-primary" />}
          />

          <FeatureCard
            title="4. Product Confirmation"
            description="Once you receive your item and confirm it matches the description, notify us through your buyer dashboard."
            icon={<ShieldCheck className="w-6 h-6 text-primary" />}
          />

          <FeatureCard
            title="5. Seller Gets Paid"
            description="After your confirmation, we release the funds to the seller. Secure, transparent, and fair for everyone."
            icon={<Coins className="w-6 h-6 text-primary" />}
          />

          <FeatureCard
            title="6. Everybody is Happy"
            description="Leave a review for the seller! Our system ensures a high-quality experience and successful deals every time."
            icon={<Smile className="w-6 h-6 text-primary" />}
          />
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <Carousel>
            <CarouselContent>
              {[
                {
                  title: "1. Add to Cart",
                  desc: "Browse our verified marketplace and add products from top-rated vendors to your cart.",
                  icon: <ShoppingCart className="w-6 h-6 text-primary" />,
                },
                {
                  title: "2. Make Payment",
                  desc: "Pay securely via our gateway. Funds are held in escrow to protect your purchase.",
                  icon: <CreditCard className="w-6 h-6 text-primary" />,
                },
                {
                  title: "3. Product Shipment",
                  desc: "Sellers are notified to ship your order and provide tracking info immediately.",
                  icon: <Truck className="w-6 h-6 text-primary" />,
                },
                {
                  title: "4. Product Confirmation",
                  desc: "Confirm the item matches the description through your buyer dashboard.",
                  icon: <ShieldCheck className="w-6 h-6 text-primary" />,
                },
                {
                  title: "5. Seller Gets Paid",
                  desc: "Once you are satisfied, we release the payment to the seller's account.",
                  icon: <Coins className="w-6 h-6 text-primary" />,
                },
                {
                  title: "6. Everybody is Happy",
                  desc: "A successful transaction protected by Shopdotfun. Don't forget to leave a review!",
                  icon: <Smile className="w-6 h-6 text-primary" />,
                },
              ].map((item, i) => (
                <CarouselItem key={i}>
                  <FeatureCard
                    title={item.title}
                    description={item.desc}
                    icon={item.icon}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="mt-5 flex items-center justify-center gap-6">
              <CarouselPrevious className="static w-10 h-10 font-lg p-3 bg-primary/10 rounded-full hover:bg-primary/20 transition translate-y-0" />
              <CarouselNext className="static w-10 h-10 p-3 bg-primary/10 rounded-full hover:bg-primary/20 transition translate-y-0" />
            </div>
          </Carousel>
        </div>
      </section>



      {/* Nav */}
      <ThemeAndScroll />



      {/* Footer scection */}
      <Footer />
    </main>
  );
}
