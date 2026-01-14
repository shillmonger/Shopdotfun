"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useState } from "react";

export default function FeaturedCollection() {
  const [activeIdx, setActiveIdx] = useState(4); // Start with the 5th item (index 4) as active

  return (
    <section className="py-20 px-4 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto text-center mb-2">
        <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-4 text-foreground">
          FEATURED COLLECTION
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
          Discover hand-picked premium products from our top-rated verified stores, 
          ensuring quality and security in every transaction.
        </p>
      </div>

      <div className="relative h-[500px] md:h-[620px] flex items-center justify-center perspective-[1500px]">
        {[
          { id: 1, name: "Vintage Denim Jacket", price: "85.00", rating: 5, image: "https://i.postimg.cc/vZW7SsZv/Vintage-Denim-Jacket.jpg" },
          { id: 2, name: "Silk Evening Gown", price: "120.00", rating: 5, image: "https://i.postimg.cc/NF3TpJqG/Silk-Evening-Gown.jpg" },
          { id: 3, name: "Classic White Tee", price: "25.00", rating: 4, image: "https://i.postimg.cc/VkcntVWg/Classic-White-Tee.jpg" },
          { id: 4, name: "Premium Cotton Shirt", price: "45.00", rating: 5, image: "https://i.postimg.cc/g2qt55zy/Premium-Cotton-Shirt.jpg" },
          { id: 5, name: "Y2K Cargo Look", price: "99.00", rating: 5, image: "https://i.postimg.cc/jdCsRHwH/Y2K-Cargo-Look.jpg" },
          { id: 6, name: "Floral Summer Dress", price: "65.00", rating: 5, image: "https://i.postimg.cc/gjW6fMk8/Floral-Summer-Dress.jpg" },
          { id: 7, name: "Casual Linen Pants", price: "55.00", rating: 4, image: "https://i.postimg.cc/SN4W5Knq/Casual-Linen-Pants.jpg" },
          { id: 8, name: "Urban Leather Wear", price: "150.00", rating: 5, image: "https://i.postimg.cc/9QnwWXQ5/Urban-Leather-Wear.jpg" },
          { id: 9, name: "Silk Night Wear Set", price: "210.00", rating: 5, image: "https://i.postimg.cc/d3rjCkDT/Silk-Night-Wear-Set.jpg" },
        ].map((product, index) => {
          const position = index - activeIdx;
          const isActive = position === 0;

          return (
            <motion.div
              key={product.id}
              onClick={() => setActiveIdx(index)}
              initial={false}
              animate={{
                x: position * 120, 
                scale: isActive ? 1.1 : 0.75,
                rotateY: position * -18, 
                zIndex: 20 - Math.abs(position),
                opacity: Math.abs(position) > 4 ? 0 : 1 - Math.abs(position) * 0.2,
                filter: isActive ? "grayscale(0%)" : "grayscale(60%) blur(1px)",
              }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className={`
                absolute rounded-[2rem] overflow-hidden cursor-pointer border border-border/40 transition-shadow duration-500
                ${isActive 
                  ? "ring-1 ring-primary/40 shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.8)]" 
                  : "shadow-md"}
                w-[200px] md:w-[260px] h-[380px] md:h-[480px] bg-card
              `}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-40'}`} />

              {/* Product Info */}
              <div className={`absolute inset-x-0 bottom-0 p-5 text-white transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={i < product.rating ? "fill-primary text-primary" : "fill-white/20 text-white/20"}
                    />
                  ))}
                </div>
                <h3 className="text-lg font-black uppercase italic tracking-tighter leading-tight">
                  {product.name}
                </h3>
                <p className="text-xl font-black text-primary italic">
                  ${product.price}
                </p>
              </div>

              {/* Price Tag for Background Cards */}
              {!isActive && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black text-foreground border border-border/20">
                  ${product.price}
                </div>
              )}
              
              {/* Top Badge */}
              {isActive && (
                <div className="absolute top-5 left-1/2 -translate-x-1/2 
                  bg-background/95 dark:bg-card/90 
                  backdrop-blur-xl border border-border
                  text-foreground 
                  px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">
                  New Arrival
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
