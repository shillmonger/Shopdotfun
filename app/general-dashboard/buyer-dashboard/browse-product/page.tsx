"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  SlidersHorizontal, 
  Star, 
  ShoppingCart, 
  ChevronRight, 
  FilterX, 
  Loader2 
} from "lucide-react";

import BuyerHeader from "@/components/buyer-dashboard/BuyerHeader";
import BuyerSidebar from "@/components/buyer-dashboard/BuyerSidebar";
import BuyerNav from "@/components/buyer-dashboard/BuyerNav";

// Mock Data for the UI
const CATEGORIES = ["Electronics", "Fashion", "Home & Garden", "Sports", "Health"];

interface Product {
  id: number;
  name: string;
  seller: string;
  price: number;
  rating: number;
  stock: number;
  image: string;
}

export default function BrowseProductsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(1000);

  // Mock Product Data
  const products: Product[] = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      name: `Premium Product ${i + 1}`,
      seller: `Elite Vendor ${i + 1}`,
      price: Math.floor(Math.random() * 500) + 50,
      rating: 4.5,
      stock: i === 3 ? 0 : 10, // Mock one out-of-stock item
      image: "https://i.postimg.cc/pLD6CsVc/download-(5).jpg",
    }));
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <BuyerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden text-foreground">
        <BuyerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-24 lg:pb-10">
          {/* Search & Header Section */}
          <section className="p-4 md:p-8 bg-card border-b border-border">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic mb-6">
                Explore Products
              </h1>
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by product or seller name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 ring-primary/20 outline-none transition-all shadow-sm"
                  />
                </div>
                <button 
                  onClick={() => setIsFilterVisible(!isFilterVisible)}
                  className="flex items-center justify-center cursor-pointer gap-2 px-6 py-3 bg-foreground text-background rounded-xl font-black uppercase text-xs tracking-widest hover:opacity-90 transition-all"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {isFilterVisible ? "Hide Filters" : "Show Filters"}
                </button>
              </div>
            </div>
          </section>

          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-[60vh]">
            {/* B. Filters Sidebar */}
            {isFilterVisible && (
              <aside className="w-full lg:w-64 p-6 border-r border-border space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Category</h3>
                  <div className="space-y-2">
                    <button 
                      onClick={() => setSelectedCategory("All")}
                      className={`block w-full text-left px-3 py-2 cursor-pointer rounded-lg text-sm transition-colors ${selectedCategory === "All" ? "bg-primary text-primary-foreground font-bold" : "hover:bg-muted"}`}
                    >
                      All Categories
                    </button>
                    {CATEGORIES.map((cat) => (
                      <button 
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`block w-full text-left px-3 py-2 cursor-pointer rounded-lg text-sm transition-colors ${selectedCategory === cat ? "bg-primary text-primary-foreground font-bold" : "hover:bg-muted"}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Price Range</h3>
                  <input 
                    type="range" 
                    min="0" 
                    max="1000" 
                    value={priceRange}
                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                    className="w-full accent-primary" 
                  />
                  <div className="flex justify-between mt-2 text-xs font-bold">
                    <span>$0</span>
                    <span>Up to ${priceRange}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Availability</h3>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 accent-primary" />
                    <span className="text-sm group-hover:text-primary">In Stock Only</span>
                  </label>
                </div>

                <button className="w-full flex items-center justify-center cursor-pointer gap-2 py-3 border border-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-colors">
                  <FilterX className="w-3 h-3" /> Reset Filters
                </button>
              </aside>
            )}

            {/* C. Product Listing Grid */}
            <section className="flex-1 p-4 md:p-8">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin mb-2" />
                  <p className="text-xs font-bold uppercase tracking-widest">Loading Catalog...</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <div 
                      key={product.id}
                      className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl hover:border-primary/50 transition-all duration-300 flex flex-col"
                    >
                      {/* Product Image */}
                      <div className="relative aspect-square bg-muted overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] flex items-center justify-center">
                            <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg">
                              Out of Stock
                            </span>
                          </div>
                        )}
                        <button className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity border border-border">
                          <Star className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Product Details */}
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="mb-2">
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{product.seller}</p>
                          <h3 className="font-bold text-sm line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                            {product.name}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1 mb-4">
                          <div className="flex text-yellow-500">
                            <Star className="w-3 h-3 fill-current" />
                          </div>
                          <span className="text-[11px] font-bold">{product.rating}</span>
                        </div>

                        <div className="mt-auto flex items-center justify-between gap-2">
                          <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">Price</p>
                            <p className="text-lg font-black italic tracking-tighter">${product.price.toFixed(2)}</p>
                          </div>
                          
                          <button 
                            disabled={product.stock === 0}
                            className={`p-3 rounded-xl transition-all shadow-lg shadow-primary/10 ${
                              product.stock === 0 
                              ? "bg-muted text-muted-foreground cursor-not-allowed" 
                              : "bg-primary text-primary-foreground hover:scale-110 active:scale-95 cursor-pointer"
                            }`}
                          >
                            <ShoppingCart className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Infinite Scroll / Pagination Placeholder */}
              <div className="mt-12 text-center">
                <button className="px-8 py-3 border border-border cursor-pointer rounded-xl text-xs font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all">
                  Load More Products
                </button>
              </div>
            </section>
          </div>
        </main>

        <BuyerNav />
      </div>
    </div>
  );
}