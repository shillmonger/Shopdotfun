"use client";

import { useEffect, useState } from "react";
import Header from "@/components/landing-page/Header";
import ThemeAndScroll from "@/components/landing-page/ThemeAndScroll";
import Footer from "@/components/landing-page/Footer";
import { PopularCategories } from "@/components/landing-page/PopularCategories";
import { Star, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";

const TOP_STORE_PRODUCTS = [
  { id: 1, brand: "adidas", name: "Cartoon Astronaut T-Shirts", price: 78, rating: 4, image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400" },
  { id: 2, brand: "adidas", name: "Cartoon Astronaut T-Shirts", price: 78, rating: 4, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400" },
  { id: 3, brand: "adidas", name: "Cartoon Astronaut T-Shirts", price: 78, rating: 4, image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400" },
  { id: 4, brand: "adidas", name: "Cartoon Astronaut T-Shirts", price: 78, rating: 4, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400" },
  { id: 5, brand: "adidas", name: "Cartoon Astronaut T-Shirts", price: 78, rating: 4, image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400" },
  { id: 6, brand: "adidas", name: "Cartoon Astronaut T-Shirts", price: 78, rating: 4, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400" },
  { id: 7, brand: "adidas", name: "Cartoon Astronaut T-Shirts", price: 78, rating: 4, image: "https://images.unsplash.com/photo-1503342392335-3764f70b8a47?w=400" },
  { id: 8, brand: "adidas", name: "Cartoon Astronaut T-Shirts", price: 78, rating: 4, image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=400" },
  { id: 9, brand: "adidas", name: "Casual Linen Trousers", price: 92, rating: 5, image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400" },
  { id: 10, brand: "adidas", name: "Floral Summer Shirt", price: 65, rating: 4, image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400" },
  { id: 11, brand: "adidas", name: "Oxford Button Down", price: 85, rating: 4, image: "https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?w=400" },
  { id: 12, brand: "adidas", name: "Classic Chino Shorts", price: 55, rating: 4, image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400" },
];

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(2);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      <section className="container max-w-[1400px] mx-auto pt-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-4 text-foreground bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
            OUR TOP STORE
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-lg">
            Discover hand-picked premium products ensuring quality and security in every transaction.
          </p>
        </div>

        {/* Product Grid: 4 columns on mobile, 4 on desktop for symmetry */}
        <div className="w-full mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-6">
            {TOP_STORE_PRODUCTS.map((product) => (
              <div 
                key={product.id} 
                className="bg-card border border-border rounded-2xl p-3 md:p-4 hover:shadow-xl transition-all group"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-secondary mb-3">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="object-cover w-full h-full cursor-pointer group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="px-1">
                  <p className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-widest mb-1">
                    {product.brand}
                  </p>
                  <h3 className="font-semibold text-foreground text-sm md:text-base leading-tight mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 md:w-4 h-4 ${i < product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted/20'}`} 
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg md:text-xl font-black text-primary">
                      ${product.price}
                    </span>
                    <button className="p-2 md:p-3 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground rounded-full transition-all cursor-pointer">
                      <ShoppingCart className="w-4 h-4 md:w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Section from Screenshot 2 */}
          <div className="flex justify-center items-center gap-2 mt-16 mb-24">
            <button className="w-10 h-10 flex items-center cursor-pointer justify-center rounded-full border border-border text-muted-foreground hover:text-primary transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg cursor-pointer font-bold transition-all ${
                  currentPage === page 
                    ? 'bg-primary text-white scale-110 shadow-lg' 
                    : 'bg-secondary text-muted-foreground hover:bg-primary/20'
                }`}
              >
                {page}
              </button>
            ))}

            <button className="w-10 h-10 flex items-center cursor-pointer justify-center rounded-full border border-border text-muted-foreground hover:text-primary transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <PopularCategories />
      </section>

      <ThemeAndScroll />
      <Footer />
    </main>
  );
}