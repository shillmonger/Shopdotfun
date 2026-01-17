import Link from "next/link";
import { ChevronRight, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HotTrendingProducts() {
  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 bg-background">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter border-l-4 border-primary pl-4 bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
              Hot Trending Products
            </h2>
          </div>
        </div>

        {/* Mobile Carousel / Desktop Grid Container */}
        <div className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory md:grid md:grid-cols-3 lg:grid-cols-6 md:overflow-visible md:pb-0 scrollbar-hide">
          {[
            { name: "JBL Boombox 3", price: 1199.00, oldPrice: 1299.00, image: "https://i.postimg.cc/nLVsYsSs/JBL-Boombox-3.jpg" },
            { name: "iPad Air 10.9-inch M1", price: 549.00, oldPrice: 599.00, image: "https://i.postimg.cc/9XZkZz68/i-Pad-Air-10-9-inch.jpg" },
            { name: "JBL Tune 720BT", price: 1499.00, oldPrice: 1599.00, image: "https://i.postimg.cc/Nj6Gng2V/JBL-Tune-720BT.jpg" },
            { name: "iPhone 14 Plus 128GB", price: 799.00, oldPrice: 899.00, image: "https://i.postimg.cc/63dh248Y/i-Phone-14-Plus-128GB.jpg" },
            { name: "iPad Pro 12.9-inch M2", price: 999.00, oldPrice: 1099.00, image: "https://i.postimg.cc/ZYxcJ3tY/i-Pad-Pro-12-9-inch-M2.jpg" },
            { name: "Apple Watch Series 9 GPS", price: 329.00, oldPrice: 399.00, image: "https://i.postimg.cc/4NwBQcB7/Apple-Watch-Series-9-GPS.jpg" },
            { name: "MacBook Air 13 M2", price: 899.00, oldPrice: 1099.00, image: "https://i.postimg.cc/W1Cm5wr0/Mac-Book-Air-13-M2.jpg" },
            { name: "Apple EarPods", price: 449.00, oldPrice: 499.00, image: "https://i.postimg.cc/43R7KLV0/AI-Air-Pods-Pro.jpg" },
            { name: "Apple Watch Ultra 2", price: 749.00, oldPrice: 799.00, image: "https://i.postimg.cc/ZR75LVBQ/Apple-Watch-Ultra-2-(2).jpg" },
            { name: "Gaming Headset", price: 3299.00, oldPrice: 3499.00, image: "https://i.postimg.cc/yYJkL4Pq/Gaming-Headset.jpg" },
            { name: "Apple Watch SE 2nd Gen", price: 219.00, oldPrice: 249.00, image: "https://i.postimg.cc/XYRFf7St/Apple-Watch-SE-2nd-Gen.jpg" },
            { name: "iPhone 13 128GB Midnight", price: 599.00, oldPrice: 699.00, image: "https://i.postimg.cc/XJcw7MP8/i-Phone-13-128GB-Midnight.jpg" },
          ].map((product, index) => (
            <div
              key={index}
              className="min-w-[280px] sm:min-w-[240px] md:min-w-0 snap-start group relative bg-card border border-border rounded-3xl p-3 transition-all duration-300 hover:shadow-xl hover:border-primary/30 flex flex-col gap-2"
            >
              {/* Product Image */}
              <div className="aspect-square rounded-2xl overflow-hidden bg-secondary/30 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Details */}
              <div className="flex flex-col flex-grow gap-1 mt-1">
                <h3 className="text-[13px] font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-1">
                  <Star size={10} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-[10px] text-muted-foreground">({index + 5})</span>
                </div>

                <div className="flex items-center gap-2 mt-auto">
                  <span className="text-[16px] font-black text-foreground">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-[12px] text-muted-foreground line-through opacity-70">
                    ${product.oldPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Add to Cart */}
              <Button
                size="sm"
                className="w-full py-5 rounded-xl cursor-pointer font-bold text-xs flex items-center gap-2 active:scale-95"
              >
                <ShoppingCart size={14} />
                Add To Cart
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
