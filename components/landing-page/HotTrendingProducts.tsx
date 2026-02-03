"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronRight, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Product {
  _id: string;
  name: string;
  price: number;
  discount: number;
  stock: number;
  shippingFee: number;
  images: Array<{
    url: string;
    thumbnailUrl: string;
    publicId: string;
  }>;
  category: string;
  averageRating?: number;
  totalRatings?: number;
  sellerName: string;
  sellerEmail: string;
}

export function HotTrendingProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=12&sortBy=totalRatings&sortOrder=desc');
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
      } else {
        toast.error('Failed to load products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      const existingItem = cart.find((item: any) => item.productId === product._id);
      
      // Check if product is out of stock
      if (product.stock <= 0) {
        toast.error('This product is out of stock');
        return;
      }
      
      if (existingItem) {
        // Check if adding one more would exceed stock
        if (existingItem.quantity >= product.stock) {
          toast.error('Cannot add more. Product is out of stock!');
          return;
        }
        existingItem.quantity += 1;
        toast.success('Product quantity updated in cart');
      } else {
        const cartItem = {
          productId: product._id,
          productName: product.name,
          sellerName: product.sellerName,
          price: product.price,
          discount: product.discount,
          quantity: 1,
          stock: product.stock,
          shippingFee: product.shippingFee,
          image: product.images[0]?.url || '',
          addedAt: new Date().toISOString()
        };
        
        cart.push(cartItem);
        toast.success('Product added to cart');
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Trigger storage event for cart page to update
      window.dispatchEvent(new Event('storage'));
      // Dispatch custom event for same-window updates (header badge)
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add product to cart');
    }
  };

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return discount > 0 ? price * (1 - discount / 100) : price;
  };

  if (loading) {
    return (
      <section className="mt-10 lg:mt-30 px-4 md:px-6 lg:px-8 bg-background">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter border-l-4 border-primary pl-4 bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
                Hot Trending Products
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="min-w-[210px] sm:min-w-[240px] md:min-w-0 bg-card border border-border rounded-3xl p-3 animate-pulse">
                <div className="aspect-square rounded-2xl bg-secondary/30 mb-2"></div>
                <div className="h-4 bg-secondary/30 rounded mb-2"></div>
                <div className="h-4 bg-secondary/30 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-10 lg:mt-30 px-4 md:px-6 lg:px-8 bg-background">
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
          {products.map((product) => {
            const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
            const hasDiscount = product.discount > 0;
            
            return (
              <div
                key={product._id}
                className="min-w-[210px] sm:min-w-[240px] md:min-w-0 snap-start group relative bg-card border border-border rounded-3xl p-3 transition-all duration-300 hover:shadow-xl hover:border-primary/30 flex flex-col gap-2"
              >
                {/* Product Image */}
                <div className="aspect-square rounded-2xl overflow-hidden bg-secondary/30 relative">
                  <img
                    src={product.images[0]?.url || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-110"
                  />
                  {hasDiscount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-sm">
                      -{product.discount}%
                    </div>
                  )}
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl">
                      <span className="text-white font-bold text-sm bg-red-500 px-3 py-1 rounded-full">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-col flex-grow gap-1 mt-1">
                  <h3 className="text-[13px] font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-1">
                    <Star size={10} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-[10px] text-muted-foreground">
                      ({product.totalRatings || 0}) {product.averageRating?.toFixed(1) || '0.0'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">Stock:</span>
                    <span className={`text-[10px] font-semibold ${
                      product.stock <= 5 ? 'text-red-600' : 
                      product.stock <= 10 ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>
                      {product.stock} units
                    </span>
                    {product.stock <= 5 && (
                      <span className="text-[10px] text-red-600 font-semibold">(Low)</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-auto">
                    <span className="text-[16px] font-black text-foreground">
                      ${discountedPrice.toFixed(2)}
                    </span>
                    {hasDiscount && (
                      <span className="text-[12px] text-muted-foreground line-through opacity-70">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Add to Cart */}
                <Button
                  size="sm"
                  className={`w-full py-5 rounded-xl cursor-pointer font-bold text-xs flex items-center gap-2 active:scale-95 ${
                    product.stock <= 0 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300' 
                      : 'bg-primary text-white dark:text-black hover:bg-primary/90'
                  }`}
                  onClick={() => addToCart(product)}
                  disabled={product.stock <= 0}
                >
                  <ShoppingCart size={14} />
                  {product.stock <= 0 ? 'Out of Stock' : 'Add To Cart'}
                </Button>
              </div>
            );
          })}
        </div>
        
        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No trending products found.</p>
          </div>
        )}
      </div>
    </section>
  );
}
