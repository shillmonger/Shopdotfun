"use client";

import { useEffect, useState } from "react";
import Header from "@/components/landing-page/Header";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import Footer from "@/components/landing-page/Footer";

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



<section className="pt-30 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-4 text-foreground bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
          OUR TOP STORE
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
          Discover hand-picked premium products from our top-rated verified stores, 
          ensuring quality and security in every transaction.
        </p>
      </div>
      {/* Category Deals Section */}
      <CategoryDeals />

    </section>


      {/* Nav */}
      <ThemeAndScroll />



      {/* Footer scection */}
      <Footer />
    </main>
  );
}
